const Company = require("../models/Company");
const Job = require("../models/Job");
const User = require("../models/User");
const mongoose = require("mongoose");
const sendResponse = require("../utils/sendResponse");

const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      experienceLevel,
      position,
      companyId,
    } = req.body;

    const user = await User.findById(req.id);
    if (!user || user.role !== "recruiter") {
      return sendResponse(res, 403, false, "Only recruiters can create jobs");
    }

    const finalExperience = experience || experienceLevel;
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !finalExperience ||
      !position ||
      !companyId
    ) {
      return sendResponse(res, 400, false, "All job fields are required");
    }

    if (!mongoose.isValidObjectId(companyId)) {
      return sendResponse(res, 400, false, "Invalid company id");
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return sendResponse(res, 404, false, "Company not found");
    }

    if (company.userId.toString() !== req.id.toString()) {
      return sendResponse(res, 403, false, "You can only create jobs for your own company");
    }

    const job = await Job.create({
      title,
      description,
      requirements: Array.isArray(requirements)
        ? requirements
        : requirements.split(",").map((item) => item.trim()).filter(Boolean),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: Number(finalExperience),
      position: Number(position),
      company: companyId,
      created_by: req.id,
    });

    const populatedJob = await Job.findById(job._id).populate("company");

    return sendResponse(res, 201, true, "Job created successfully", populatedJob);
  } catch (error) {
    console.error("Create job error:", error.message);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = keyword
      ? {
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
            { location: { $regex: keyword, $options: "i" } },
            { jobType: { $regex: keyword, $options: "i" } },
          ],
        }
      : {};

    const jobs = await Job.find(query).populate("company").sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "Jobs fetched successfully", jobs);
  } catch (error) {
    console.error("Get all jobs error:", error.message);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

const getJobById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendResponse(res, 400, false, "Invalid job id");
    }

    const job = await Job.findById(req.params.id)
      .populate("company")
      .populate({
        path: "applications",
        populate: {
          path: "applicant",
          select: "fullname email phoneNumber role profile",
        },
      });

    if (!job) {
      return sendResponse(res, 404, false, "Job not found");
    }

    return sendResponse(res, 200, true, "Job fetched successfully", job);
  } catch (error) {
    console.error("Get job by id error:", error.message);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ created_by: req.id }).populate("company").sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "Recruiter jobs fetched successfully", jobs);
  } catch (error) {
    console.error("Get recruiter jobs error:", error.message);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

const updateJob = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendResponse(res, 400, false, "Invalid job id");
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return sendResponse(res, 404, false, "Job not found");
    }

    if (job.created_by.toString() !== req.id.toString()) {
      return sendResponse(res, 403, false, "You can only update your own jobs");
    }

    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      experienceLevel,
      position,
      companyId,
    } = req.body;

    if (companyId) {
      if (!mongoose.isValidObjectId(companyId)) {
        return sendResponse(res, 400, false, "Invalid company id");
      }

      const company = await Company.findById(companyId);
      if (!company) {
        return sendResponse(res, 404, false, "Company not found");
      }

      if (company.userId.toString() !== req.id.toString()) {
        return sendResponse(res, 403, false, "You can only assign your own company");
      }

      job.company = companyId;
    }

    if (title !== undefined) job.title = title;
    if (description !== undefined) job.description = description;
    if (requirements !== undefined) {
      job.requirements = Array.isArray(requirements)
        ? requirements
        : requirements.split(",").map((item) => item.trim()).filter(Boolean);
    }
    if (salary !== undefined) job.salary = Number(salary);
    if (location !== undefined) job.location = location;
    if (jobType !== undefined) job.jobType = jobType;
    if (experience !== undefined || experienceLevel !== undefined) {
      job.experienceLevel = Number(experience || experienceLevel);
    }
    if (position !== undefined) job.position = Number(position);

    await job.save();

    const updatedJob = await Job.findById(job._id).populate("company");
    return sendResponse(res, 200, true, "Job updated successfully", updatedJob);
  } catch (error) {
    console.error("Update job error:", error.message);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  getRecruiterJobs,
  updateJob,
};
