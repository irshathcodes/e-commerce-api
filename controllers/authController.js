const User = require("../models/User");
const { CustomApiError, stsCodes } = require("../errors/CustomApiError");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const register = async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		throw new CustomApiError(stsCodes.BAD_REQUEST, "All Fields are required");
	}

	const isUserExists = await User.findOne({ email });

	if (isUserExists) {
		throw new CustomApiError(
			stsCodes.BAD_REQUEST,
			"User All ready exists, please login"
		);
	}

	const verificationOtp = crypto.randomInt(100000, 999999);

	const user = await User.create({ name, email, password, verificationOtp });

	sendEmail({
		to: user.email,
		subject: "User Account Verification",
		html: `<p> OTP Verification code: <b> ${user.verificationOtp} </b> </p>  `,
	});

	res.cookie("user-details", user.email, {
		httpOnly: true,
	});
	res
		.status(stsCodes.CREATED)
		.json({ msg: "Check your email for otp verification.", email: user.email });
};

const verifyUser = async (req, res) => {
	const { email, verificationOtp } = req.body;
};

const login = async (req, res) => {
	res.send("login");
};

module.exports = { register, verifyUser, login };
