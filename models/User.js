const mongoose = require("mongoose");
const validator = require("validator");

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
});

module.exports = mongoose.model("User", UserSchema);
