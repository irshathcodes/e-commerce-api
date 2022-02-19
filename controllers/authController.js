const User = require("../models/User");
const CustomError = require("../errors/CustomError");
const crypto = require("crypto");
const Token = require("../models/Token");
const {
	createJWT,
	isTokenValid,
	attachCookieToResponse,
} = require("../utils/jwt");
const sendEmail = require("../utils/sendEmail");

async function register(req, res) {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		throw new CustomError(400, "All Fields are required");
	}

	const isUserExists = await User.findOne({ email });

	if (isUserExists) {
		throw new CustomError(400, "User All ready exists, please login");
	}

	const verificationOtp = crypto.randomInt(100000, 999999);

	const user = await User.create({ name, email, password, verificationOtp });

	sendEmail({
		to: user.email,
		subject: "User Account Verification",
		html: `<span> OTP Verification code: <h1> ${user.verificationOtp} </h1> </span>  `,
	});

	const verificationToken = createJWT({ email: user.email }); // only object can expiration in JWT remember that.

	res.cookie("verificationToken", verificationToken, {
		httpOnly: true,
		signed: true,
		expires: new Date(Date.now() + 1000 * 60 * 2),
	});

	res.status(201).json({ msg: "Check your email for otp verification." });
}

async function verifyUser(req, res) {
	const { verificationOtp } = req.body;
	const { verificationToken } = req.signedCookies;

	if (!verificationOtp) {
		throw new CustomError(
			400,
			"Verification time expired, Please send token again."
		);
	}

	try {
		const { email } = isTokenValid(verificationToken);

		const user = await User.findOne({ email, verificationOtp });

		if (!user) {
			throw new CustomError(400, "Invalid Otp!!");
		}
		await User.updateOne(
			{ _id: user._id },
			{
				$unset: { verificationOtp: "" },
				$set: { isVerified: true },
			}
		);

		res.cookie("verificationToken", "done", { expires: new Date(Date.now()) });
		res.status(200).json({ msg: "User Verified. Please Login." });
	} catch (error) {
		throw new CustomError(401, "Error, Please try again later");
	}
}

async function login(req, res) {
	const { email, password } = req.body;

	if (!email || !password) {
		throw new CustomError(400, "All Fields are required");
	}

	const user = await User.findOne({ email });

	if (!user) {
		throw new CustomError(401, "Invalid Credentials");
	}

	if (!user.isVerified) {
		throw new CustomError(401, "User not verified!!");
	}

	const isPasswordMatch = await user.comparePassword(password);

	if (!isPasswordMatch) {
		throw new CustomError(401, "Incorrect Password");
	}

	let refreshToken = "";

	const existingToken = await Token.findOne({ userId: user._id });

	if (existingToken) {
		const { isValid } = existingToken;
		if (!isValid) {
			throw new CustomError(403, "User is not a valid user");
		}
		refreshToken = existingToken.refreshToken;
		attachCookieToResponse({ res, userId: user._id, refreshToken });
		res.status(200).json({ username: user.name });
		return;
	}

	refreshToken = crypto.randomBytes(40).toString("hex");

	const tokenDetails = {
		refreshToken,
		ip: req.ip,
		userAgent: req.headers["user-agent"],
		userId: user._id,
	};

	await Token.create(tokenDetails);

	attachCookieToResponse({ res, userId: user._id, refreshToken });

	res.status(200).json({ username: user.name });
}

module.exports = { register, verifyUser, login };
