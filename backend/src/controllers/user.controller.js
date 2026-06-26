const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendResponse = require("../utils/sendResponse");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const { getAuthCookieOptions } = require("../utils/authCookie");

const sanitizeUser = (user) => ({
  _id: user._id,
  fullname: user.fullname,
  email: user.email,
  phoneNumber: user.phoneNumber,
  role: user.role,
  profile: user.profile,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

/**
 * Upload a profile photo in the background after the user has already been
 * created. The signup response is sent immediately; if the upload succeeds
 * within the timeout window the user document is updated silently.
 * This removes the Cloudinary round-trip from the critical signup path.
 */
const uploadProfilePhotoInBackground = (file, userId) => {
  if (!file || !userId) return;

  const TIMEOUT_MS = 10000;
  let timeoutId;

  const timeout = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      console.error("Background profile photo upload timed out — skipped");
      resolve(null);
    }, TIMEOUT_MS);
  });

  Promise.race([
    uploadToCloudinary(file, "job-portal/profile-photos"),
    timeout,
  ])
    .then(async (cloudResponse) => {
      clearTimeout(timeoutId);
      if (!cloudResponse?.secure_url) return;
      await User.findByIdAndUpdate(userId, {
        "profile.profilePhoto": cloudResponse.secure_url,
      });
    })
    .catch((error) => {
      clearTimeout(timeoutId);
      console.error("Background profile photo upload failed:", error.message);
    });
};

const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return sendResponse(res, 400, false, "All fields are required");
    }

    if (!["student", "recruiter"].includes(role)) {
      return sendResponse(res, 400, false, "Role must be student or recruiter");
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendResponse(res, 400, false, "User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user immediately — do NOT wait for Cloudinary.
    const user = await User.create({
      fullname,
      email: email.toLowerCase(),
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: "",
      },
    });

    // Fire-and-forget: upload photo after responding so signup is instant.
    uploadProfilePhotoInBackground(req.file, user._id);

    return sendResponse(res, 201, true, "User registered successfully", sanitizeUser(user));
  } catch (error) {
    console.error("Register error:", error.message);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return sendResponse(res, 400, false, "Email, password, and role are required");
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return sendResponse(res, 400, false, "Incorrect email or password");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return sendResponse(res, 400, false, "Incorrect email or password");
    }

    if (role !== user.role) {
      return sendResponse(res, 400, false, "Account does not exist with current role");
    }

    if (!process.env.SECRET_KEY) {
      console.error("Critical backend error: SECRET_KEY is missing");
      return sendResponse(res, 500, false, "Server authentication configuration error");
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res.status(200).cookie("token", token, getAuthCookieOptions()).json({
      success: true,
      message: `Welcome back ${user.fullname}`,
      data: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        ...getAuthCookieOptions(),
        maxAge: 0,
      })
      .json({
        success: true,
        message: "Logged out successfully",
        data: null,
      });
  } catch (error) {
    console.error("Logout error:", error.message);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const user = await User.findById(req.id);

    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    if (email && email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return sendResponse(res, 400, false, "Email is already in use");
      }
      user.email = email;
    }

    if (fullname) user.fullname = fullname;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio !== undefined) user.profile.bio = bio;
    if (skills !== undefined) {
      user.profile.skills = Array.isArray(skills)
        ? skills
        : skills.split(",").map((skill) => skill.trim()).filter(Boolean);
    }

    const cloudResponse = await uploadToCloudinary(req.file, "job-portal/resumes");
    if (cloudResponse) {
      const mimeType = req.file.mimetype || "";
      if (mimeType.startsWith("image/")) {
        user.profile.profilePhoto = cloudResponse.secure_url;
      } else {
        user.profile.resume = cloudResponse.secure_url;
        user.profile.resumeOriginalName = req.file.originalname;
      }
    }

    await user.save();

    return sendResponse(res, 200, true, "Profile updated successfully", sanitizeUser(user));
  } catch (error) {
    console.error("Update profile error:", error.message);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

module.exports = {
  register,
  login,
  logout,
  updateProfile,
};