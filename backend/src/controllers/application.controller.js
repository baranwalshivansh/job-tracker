const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const mongoose = require("mongoose");
const sendResponse = require("../utils/sendResponse");

const applyForJob = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    if (!user || user.role !== "student") {
      return sendResponse(res, 403, false, "Only students can apply for jobs");
    }

    const jobId = req.params.id;
    if (!jobId) {
      return sendResponse(res, 400, false, "Job id is required");
    }

    if (!mongoose.isValidObjectId(jobId)) {
      return sendResponse(res, 400, false, "Invalid job id");
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return sendResponse(res, 404, false, "Job not found");
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.id,
    });

    if (existingApplication) {
      return sendResponse(res, 400, false, "You have already applied for this job");
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.id,
    });

    job.applications.push(application._id);
    await job.save();

    return sendResponse(res, 201, true, "Job applied successfully", application);
  } catch (error) {
    if (error.code === 11000) {
      return sendResponse(res, 400, false, "You have already applied for this job");
    }

    console.error("Apply job error:", error.message);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

const getAppliedJobs = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.id })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: {
          path: "company",
        },
      });

    return sendResponse(res, 200, true, "Applied jobs fetched successfully", applications);
  } catch (error) {
    console.error("Get applied jobs error:", error.message);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

const getApplicants = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendResponse(res, 400, false, "Invalid job id");
    }

    const job = await Job.findById(req.params.id).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
        select: "fullname email phoneNumber role profile",
      },
    });

    if (!job) {
      return sendResponse(res, 404, false, "Job not found");
    }

    if (job.created_by.toString() !== req.id.toString()) {
      return sendResponse(res, 403, false, "You can only view applicants for your own jobs");
    }

    return sendResponse(res, 200, true, "Applicants fetched successfully", job);
  } catch (error) {
    console.error("Get applicants error:", error.message);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return sendResponse(res, 400, false, "Status is required");
    }

    const normalizedStatus = status.toLowerCase();
    if (!["pending", "accepted", "rejected"].includes(normalizedStatus)) {
      return sendResponse(res, 400, false, "Status must be pending, accepted, or rejected");
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendResponse(res, 400, false, "Invalid application id");
    }

    const application = await Application.findById(req.params.id).populate("job");
    if (!application) {
      return sendResponse(res, 404, false, "Application not found");
    }

    if (application.job.created_by.toString() !== req.id.toString()) {
      return sendResponse(res, 403, false, "You can only update applications for your own jobs");
    }

    application.status = normalizedStatus;
    await application.save();

    return sendResponse(res, 200, true, "Application status updated successfully", application);
  } catch (error) {
    console.error("Update application status error:", error.message);
    return sendResponse(res, 500, false, "Internal server error");
  }
};

module.exports = {
  applyForJob,
  getAppliedJobs,
  getApplicants,
  updateApplicationStatus,
};
