const jwt = require("jsonwebtoken");
const sendResponse = require("../utils/sendResponse");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return sendResponse(res, 401, false, "User not authenticated");
    }

    if (!process.env.SECRET_KEY) {
      console.error("Critical backend error: SECRET_KEY is missing");
      return sendResponse(res, 500, false, "Server authentication configuration error");
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded || !decoded.userId) {
      return sendResponse(res, 401, false, "Invalid token");
    }

    req.id = decoded.userId;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return sendResponse(res, 401, false, "Invalid or expired token");
  }
};

module.exports = isAuthenticated;
