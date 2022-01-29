const express = require("express");
const Router = express.Router();

const {
	register,
	login,
	verifyUser,
} = require("../controllers/authController");

Router.post("/register", register);
Router.post("/login", login);
Router.post("/verify-user", verifyUser);
module.exports = Router;
