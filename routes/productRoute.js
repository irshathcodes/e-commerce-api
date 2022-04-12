const express = require("express");
const router = express.Router();
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
} = require("../controllers/productController");

router
	.route("/")
	.get(getAllProducts)
	.post(
		authenticationMiddleware,
		authorizationPermission,
		upload.single("productImage"),
		createProduct
	);

router
	.route("/:id")
	.get(getSingleProduct)
	.patch(authenticationMiddleware, authorizationPermission, updateProduct)
	.delete(authenticationMiddleware, authorizationPermission, deleteProduct);

module.exports = router;
