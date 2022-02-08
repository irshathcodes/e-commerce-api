const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
	{
		productName: { type: String, required: true },
		productDescription: { type: String, required: true },
		price: { type: Number, required: true },
		category: { type: String, required: true },
		featured: { type: Boolean, default: false },
		size: String,
		color: String,
		productImage: { type: String, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema, { strict: false });
