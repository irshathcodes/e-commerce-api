const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const { CustomApiError, stsCodes } = require("../errors/CustomApiError");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "username should be provided"],
		minlength: [2, "name is too short"],
		maxlength: [50, "name is too big"],
	},
	email: {
		type: String,
		required: [true, "Email cannot be empty"],
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: (props) => `${props.value} is not a valid email id`,
		},
	},
	password: {
		type: String,
		required: [true, "password is required"],
		min: [8, "password is too short"],
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	verificationOtp: Number,
});

UserSchema.pre("save", async function () {
	const isStrongPassword = validator.isStrongPassword(this.password);
	if (!isStrongPassword) {
		throw new CustomApiError(
			stsCodes.BAD_REQUEST,
			"Provide a strong password include Uppercase, numbers, special characters"
		);
	}
	const salt = await bcryptjs.genSalt(10);
	this.password = await bcryptjs.hash(this.password, salt);
});

module.exports = mongoose.model("User", UserSchema);
