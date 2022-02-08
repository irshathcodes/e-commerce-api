const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const CustomApiError = require("../errors/CustomApiError");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "username should be provided"],
		minlength: [2, "name is too short"],
		maxlength: [50, "name is too big"],
	},
	role: {
		type: String,
		enum: ["user", "admin"],
		default: "user",
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
			400,
			"Provide a strong password include Uppercase, numbers, special characters"
		);
	}

	if (!this.isModified("password")) return;

	const salt = await bcryptjs.genSalt(10);
	this.password = await bcryptjs.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (passwordString) {
	const isPasswordMatch = await bcryptjs.compare(passwordString, this.password);
	return isPasswordMatch;
};

module.exports = mongoose.model("User", UserSchema);
