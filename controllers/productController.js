const User = require("../models/User");
const Product = require("../models/Product");
const CustomApiError = require("../errors/CustomApiError");

async function getAllProducts(req, res) {
	const products = await Product.find({});
	res.status(200).json({ products });
}

async function getSingleProduct(req, res) {
	const singleProduct = await Product.findOne({ _id: req.params.id });
	res.status(200).json({ singleProduct });
}

async function createProduct(req, res) {
	const user = await User.findOne({ _id: req.user });
	if (user.role !== "admin") {
		throw new CustomApiError(403, "Not allowed to access this route");
	}
	const product = await Product.create(req.body);
	res.status(201).json({ product });
}

async function updateProduct(req, res) {
	const updatedProduct = await Product.findOneAndUpdate(
		{ _id: req.params.id },
		req.body,
		{ runValidators: true, new: true }
	);
	res.status(200).json({ updatedProduct });
}

async function deleteProduct(req, res) {
	const deletedProduct = await Product.findOneAndDelete({ _id: req.params.id });
	res.status(200).json({ msg: "product deleted successfully" });
}

module.exports = {
	getAllProducts,
	getSingleProduct,
	createProduct,
	updateProduct,
	deleteProduct,
};
