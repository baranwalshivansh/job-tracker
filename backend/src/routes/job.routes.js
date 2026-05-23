const express = require("express");
const {
  createJob,
  getAllJobs,
  getJobById,
  getRecruiterJobs,
  updateJob,
} = require("../controllers/job.controller");
const isAuthenticated = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/post", isAuthenticated, createJob);
router.post("/create", isAuthenticated, createJob);
router.get("/get", isAuthenticated, getAllJobs);
router.get("/getadminjobs", isAuthenticated, getRecruiterJobs);
router.get("/admin", isAuthenticated, getRecruiterJobs);
router.put("/update/:id", isAuthenticated, updateJob);
router.patch("/update/:id", isAuthenticated, updateJob);
router.get("/get/:id", isAuthenticated, getJobById);

module.exports = router;
