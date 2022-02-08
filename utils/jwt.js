const jwt = require("jsonwebtoken");

const createJWT = (payload) => {
	const token = jwt.sign(payload, process.env.JWT_SECRET);
	return token;
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookieToResponse = ({ res, userId, refreshToken }) => {
	const accessToken = createJWT({ userId });
	const refreshTokenJWT = createJWT({ userId, refreshToken });

	const oneDay = 1000 * 60 * 2;

	res.cookie("accessToken", accessToken, {
		maxAge: 1000 * 60,
		signed: true,
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
	});

	res.cookie("refreshToken", refreshTokenJWT, {
		httpOnly: true,
		expires: new Date(Date.now() + oneDay),
		signed: true,
		secure: process.env.NODE_ENV === "production",
	});
};

module.exports = { createJWT, isTokenValid, attachCookieToResponse };
