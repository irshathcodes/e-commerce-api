const mongoose = require("mongoose");
const validator = require("validator");

const OrderItemSchema = new mongoose.Schema({
	name: { type: String, required: true },
	image: { type: String, required: true },
	price: { type: Number, required: true },
	quantity: { type: Number, required: true },
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
		required: true,
	},
});

const ShippingDetailsSchema = new mongoose.Schema({
	email: {
		type: String,
		validate: {
			validator: validator.isEmail,
			message: (props) => `${props.value} is not an valid email`,
		},
		required: true,
	},
	phoneNo: Number,
	name: {
		type: String,
		required: true,
		trim: true,
		minlength: [2, "name is too short"],
		maxlength: [50, "name is too big"],
	},
	address: { type: String, required: true },
	city: { type: String, required: true },
	postcode: { type: String, required: true },
	country: { type: String, required: true },
});

const OrderSchema = new mongoose.Schema(
	{
		tax: { type: Number, required: true },
		shippingfee: { type: Number, required: true },
		subtotal: { type: Number, required: true },
		total: { type: Number, required: true },
		orderItems: [OrderItemSchema],
		status: {
			type: String,
			enum: ["pending", "paid", "delivered", "cancelled", "failed"],
			default: "pending",
		},
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		shippingDetails: ShippingDetailsSchema,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
