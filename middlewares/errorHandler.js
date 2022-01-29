module.exports = function errorHandler(err, req, res, next) {
	const customError = {
		statusCode: err.statusCode || 500,
		message: err.message || "Something went wrong (: please try again later.",
	};

	res.status(customError.statusCode).json({ msg: customError.message });
};
