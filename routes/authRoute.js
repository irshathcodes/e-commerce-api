const express = require("express");
const router = express.Router();

const {
	register,
	login,
	verifyUser,
	forgotPassword,
	resetPassword,
	logout,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/verify-user", verifyUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.delete("/logout", logout);

module.exports = router;
