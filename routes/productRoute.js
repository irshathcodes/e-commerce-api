const express = require("express");
const Router = express.Router();

const {
	authenticationMiddleware,
	authorizationPermission,
} = require("../middlewares/authentication");
const {
	getAllProducts,
	getSingleProduct,
	createProduct,
	updateProduct,
	deleteProduct,
} = require("../controllers/productController");

Router.route("/")
	.get(getAllProducts)
	.post(authenticationMiddleware, authorizationPermission, createProduct);

Router.route("/:id")
	.get(getSingleProduct)
	.patch(authenticationMiddleware, authorizationPermission, updateProduct)
	.delete(authenticationMiddleware, authorizationPermission, deleteProduct);

module.exports = Router;
