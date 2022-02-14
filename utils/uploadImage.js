const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/uploads/");
	},
	filename: function (req, file, cb) {
		const uniqueFilename =
			file.fieldname + "-" + Date.now() + path.extname(file.originalname);
		cb(null, uniqueFilename);
	},
});

module.exports = multer({ storage });
