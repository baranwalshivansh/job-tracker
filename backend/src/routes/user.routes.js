const express = require("express");
const {
  register,
  login,
  logout,
  updateProfile,
} = require("../controllers/user.controller");
const isAuthenticated = require("../middleware/auth.middleware");
const { singleUpload } = require("../middleware/multer.middleware");

const router = express.Router();

router.post("/register", singleUpload, register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/profile/update", isAuthenticated, singleUpload, updateProfile);

module.exports = router;
