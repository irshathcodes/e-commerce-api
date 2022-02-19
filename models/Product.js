const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		price: { type: Number, required: true },
		category: { type: String, required: true },
		featured: { type: Boolean, default: false },
		size: String,
		color: String,
		image: { type: String, required: true },
	},
	{ timestamps: true, strict: false }
);

module.exports = mongoose.model("Product", ProductSchema);
