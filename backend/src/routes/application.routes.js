const express = require("express");
const {
  applyForJob,
  getAppliedJobs,
  getApplicants,
  updateApplicationStatus,
} = require("../controllers/application.controller");
const isAuthenticated = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/apply/:id", isAuthenticated, applyForJob);
router.post("/apply/:id", isAuthenticated, applyForJob);
router.get("/get", isAuthenticated, getAppliedJobs);
router.get("/:id/applicants", isAuthenticated, getApplicants);
router.post("/status/:id/update", isAuthenticated, updateApplicationStatus);
router.patch("/status/:id", isAuthenticated, updateApplicationStatus);

module.exports = router;
