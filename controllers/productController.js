const User = require("../models/User");
const Product = require("../models/Product");
const CustomApiError = require("../errors/CustomApiError");

async function getAllProducts(req, res) {
	const products = await Product.find({});
	res.status(200).json({ products });
}

async function getSingleProduct(req, res) {
	if (!req.params.id) throw new CustomApiError(400, "product id is required");

	const singleProduct = await Product.findOne({ _id: req.params.id });

	if (!singleProduct) throw new CustomApiError(404, "No product found");
	res.status(200).json({ singleProduct });
}

async function createProduct(req, res) {
	if (!req.body) throw new CustomApiError(400, "Bad Request");

	const product = await Product.create(req.body);
	res.status(201).json({ product });
}

async function updateProduct(req, res) {
	if (!req.params.id || !req.body)
		throw new CustomApiError(400, "required fields are missing");

	const updatedProduct = await Product.findOneAndUpdate(
		{ _id: req.params.id },
		req.body,
		{ runValidators: true, new: true }
	);

	if (!updatedProduct)
		throw new CustomApiError(404, "No Product found to update");

	res.status(200).json({ updatedProduct });
}

async function deleteProduct(req, res) {
	if (!req.params.id)
		throw new CustomApiError(400, "required fields are missing");

	const deletedProduct = await Product.findOneAndDelete({ _id: req.params.id });

	if (!deletedProduct)
		throw new CustomApiError(404, "No Product found to delete");

	res.status(200).json({ msg: "product deleted successfully" });
}

module.exports = {
	getAllProducts,
	getSingleProduct,
	createProduct,
	updateProduct,
	deleteProduct,
};
