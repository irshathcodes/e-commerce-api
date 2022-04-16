const Product = require("../models/Product");
const CustomError = require("../errors/CustomError");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

async function getAllProducts(req, res) {
	const { sort, select, page, limit, numericFilters, ...queryObject } =
		req.query;

	if (queryObject.name)
		queryObject.name = { $regex: queryObject.name, $options: "i" };

	if (numericFilters) {
		const operatorMap = {
			">": "$gt",
			"<": "$lt",
			">=": "$gte",
			"<=": "$lte",
			"==": "$eq",
		};

		const regex = /\b(<|<=|==|>|>=)\b/g;

		// Replacing readable syntax to mongoose operators using regex.
		numericFilters
			.replace(regex, (match) => `-${operatorMap[match]}-`)
			.split(",") // spliting filters if there are multiple numeric filters (eg: NumericFilters=price>300,rating<=4.5)
			.forEach((eachFilter) => {
				const [field, operator, value] = eachFilter.split("-");
				queryObject[field] = { [operator]: Number(value) }; // changed to mongoose query (eg: price: {$gt: 400})
			});
	}

	let result = Product.find(queryObject);

	//sorting products
	if (sort) {
		const sortedList = sort.split(",").join(" ");
		result = result.sort(sortedList);
	} else {
		result = result.sort("-createdAt");
	}

	// selecting specific fields in the products document
	if (select) {
		const selectedFields = select.split(",").join(" ");
		result = result.select(selectedFields);
	}

	//Creating Pagination
	const pageNo = Number(page) || 1;
	const limitProducts = Number(limit) || 10;
	const skip = (pageNo - 1) * limitProducts;

	result = result.skip(skip).limit(limitProducts);

	const products = await result;

	res.status(200).json({ nbHits: products.length, products });
}

async function getSingleProduct(req, res) {
	if (!req.params.id) throw new CustomError(400, "product id is required");

	const singleProduct = await Product.findOne({ _id: req.params.id });

	if (!singleProduct) throw new CustomError(404, "No product found");
	res.status(200).json({ singleProduct });
}

async function getAllCategories(req, res) {
	const product = await Product.distinct("category");
	res.status(200).json(product);
}

async function createProduct(req, res) {
	if (!req.body) throw new CustomError(400, "Bad Request");

	const product = await Product.create(req.body);

	const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
		public_id: product._id,
		folder: "products",
	});

	const updatedProduct = await Product.findOneAndUpdate(
		{ _id: product._id },
		{ productImage: uploadedImage.secure_url },
		{ new: true, runValidators: true }
	);

	fs.unlinkSync(req.file.path);

	res.status(201).json({ updatedProduct });
}

async function updateProduct(req, res) {
	if (!req.params.id || !req.body)
		throw new CustomError(400, "required fields are missing");

	const updatedProduct = await Product.findOneAndUpdate(
		{ _id: req.params.id },
		req.body,
		{ runValidators: true, new: true }
	);

	if (!updatedProduct) throw new CustomError(404, "No Product found to update");

	res.status(200).json({ updatedProduct });
}

async function deleteProduct(req, res) {
	if (!req.params.id) throw new CustomError(400, "required fields are missing");

	const deletedProduct = await Product.findOneAndDelete({ _id: req.params.id });

	if (!deletedProduct) throw new CustomError(404, "No Product found to delete");

	res.status(200).json({ msg: "product deleted successfully" });
}

module.exports = {
	getAllProducts,
	getSingleProduct,
	getAllCategories,
	createProduct,
	updateProduct,
	deleteProduct,
};
