const CustomApiError = require("../errors/CustomApiError");
const Token = require("../models/Token");
const { isTokenValid, attachCookieToResponse } = require("../utils/jwt");

module.exports = async function authenticationMiddleware(req, res, next) {
	const { accessToken, refreshToken } = req.signedCookies;
	try {
		if (accessToken) {
			const payload = isTokenValid(accessToken);
			req.user = payload.userId;
			return next();
		}

		const payload = isTokenValid(refreshToken);
		const existingToken = await Token.findOne({
			userId: payload.userId,
			refreshToken: payload.refreshToken,
		});

		if (!existingToken || !existingToken.isValid) {
			throw new CustomApiError(403, "Authentication Failed");
		}

		attachCookieToResponse({
			res,
			userId: existingToken.userId,
			refreshToken: existingToken.refreshToken,
		});

		req.user = payload.userId;

		next();
	} catch (error) {
		throw new CustomApiError(401, "Authentication Invalid");
	}
};
