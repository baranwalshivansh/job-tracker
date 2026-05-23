const Company = require("../models/Company");
const User = require("../models/User");
const mongoose = require("mongoose");
const sendResponse = require("../utils/sendResponse");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const ensureRecruiter = async (userId) => {
  const user = await User.findById(userId);
  return user && user.role === "recruiter";
};

const createCompany = async (req, res) => {
  try {
    const { companyName, name } = req.body;
    const finalName = companyName || name;

    if (!(await ensureRecruiter(req.id))) {
      return sendResponse(res, 403, false, "Only recruiters can create companies");
    }

    if (!finalName) {
      return sendResponse(res, 400, false, "Company name is required");
    }

    const existingCompany = await Company.findOne({ name: finalName });
    if (existingCompany) {
      return sendResponse(res, 400, false, "Company already exists");
    }

    const company = await Company.create({
      name: finalName,
      userId: req.id,
    });

    await User.findByIdAndUpdate(req.id, {
      "profile.company": company._id,
    });

    return sendResponse(res, 201, true, "Company registered successfully", company);
  } catch (error) {
    console.error("Create company error:", error.message);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

const getRecruiterCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.id }).sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "Companies fetched successfully", companies);
  } catch (error) {
    console.error("Get companies error:", error.message);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

const getCompanyById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendResponse(res, 400, false, "Invalid company id");
    }

    const company = await Company.findById(req.params.id);

    if (!company) {
      return sendResponse(res, 404, false, "Company not found");
    }

    return sendResponse(res, 200, true, "Company fetched successfully", company);
  } catch (error) {
    console.error("Get company by id error:", error.message);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendResponse(res, 400, false, "Invalid company id");
    }

    const company = await Company.findById(req.params.id);
    if (!company) {
      return sendResponse(res, 404, false, "Company not found");
    }

    if (company.userId.toString() !== req.id.toString()) {
      return sendResponse(res, 403, false, "You can only update your own company");
    }

    if (name && name !== company.name) {
      const existingCompany = await Company.findOne({ name });
      if (existingCompany) {
        return sendResponse(res, 400, false, "Company name is already in use");
      }
      company.name = name;
    }

    if (description !== undefined) company.description = description;
    if (website !== undefined) company.website = website;
    if (location !== undefined) company.location = location;

    const cloudResponse = await uploadToCloudinary(req.file, "job-portal/company-logos");
    if (cloudResponse) {
      company.logo = cloudResponse.secure_url;
    }

    await company.save();

    return sendResponse(res, 200, true, "Company information updated", company);
  } catch (error) {
    console.error("Update company error:", error.message);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

module.exports = {
  createCompany,
  getRecruiterCompanies,
  getCompanyById,
  updateCompany,
};
