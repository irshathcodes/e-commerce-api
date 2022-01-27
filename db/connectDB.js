const mongoose = require("mongoose");

module.exports = function connectDB(url) {
	return mongoose.connect(url);
};
