const express = require("express");
const {
  createCompany,
  getRecruiterCompanies,
  getCompanyById,
  updateCompany,
} = require("../controllers/company.controller");
const isAuthenticated = require("../middleware/auth.middleware");
const { singleUpload } = require("../middleware/multer.middleware");

const router = express.Router();

router.post("/register", isAuthenticated, createCompany);
router.post("/create", isAuthenticated, createCompany);
router.get("/get", isAuthenticated, getRecruiterCompanies);
router.get("/get/:id", isAuthenticated, getCompanyById);
router.put("/update/:id", isAuthenticated, singleUpload, updateCompany);

module.exports = router;
