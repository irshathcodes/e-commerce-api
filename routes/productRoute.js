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
	uploadProductImg,
	insertProducts,
} = require("../controllers/productController");

router
	.route("/")
	.get(getAllProducts)
	.post(authenticationMiddleware, authorizationPermission, createProduct);

router
	.route("/:id")
	.get(getSingleProduct)
	.patch(authenticationMiddleware, authorizationPermission, updateProduct)
	.delete(authenticationMiddleware, authorizationPermission, deleteProduct);

router.post(
	"/upload-product-img",
	upload.single("productImage"),
	uploadProductImg
);

router.post("/insert-products", insertProducts);

module.exports = router;
