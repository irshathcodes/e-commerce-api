const express = require("express");
const Router = express.Router();
const upload = require("../utils/uploadImage");

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
	uploadProductImg,
	insertProducts,
} = require("../controllers/productController");

Router.route("/")
	.get(getAllProducts)
	.post(authenticationMiddleware, authorizationPermission, createProduct);

Router.route("/:id")
	.get(getSingleProduct)
	.patch(authenticationMiddleware, authorizationPermission, updateProduct)
	.delete(authenticationMiddleware, authorizationPermission, deleteProduct);

Router.post(
	"/upload-product-img",
	upload.single("productImage"),
	uploadProductImg
);

Router.post("/insert-products", insertProducts);

module.exports = Router;
