const express = require("express");
const Router = express.Router();

const authenticationMiddleware = require("../middlewares/authentication");
const {
	getAllProducts,
	getSingleProduct,
	createProduct,
	updateProduct,
	deleteProduct,
} = require("../controllers/productController");

Router.route("/")
	.get(getAllProducts)
	.post(authenticationMiddleware, createProduct);

Router.route("/:id")
	.get(getSingleProduct)
	.patch(authenticationMiddleware, updateProduct)
	.delete(authenticationMiddleware, deleteProduct);

module.exports = Router;
