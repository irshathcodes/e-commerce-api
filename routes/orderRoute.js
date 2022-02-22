const express = require("express");
const router = express.Router();

const {
	createOrder,
	addShippingDetails,
	getAllOrders,
	updateOrder,
	getMyOrders,
	getMySingleOrder,
} = require("../controllers/orderController");

const {
	authenticationMiddleware,
	authorizationPermission,
} = require("../middlewares/authentication");

router
	.route("/")
	.post(authenticationMiddleware, createOrder)
	// Admin Access Only.
	.get(authenticationMiddleware, authorizationPermission, getAllOrders);

router.get("/my-orders", authenticationMiddleware, getMyOrders);
router.get(
	"/my-single-order/:orderId",
	authenticationMiddleware,
	getMySingleOrder
);

router.post("/shipping-address", authenticationMiddleware, addShippingDetails);

// Admin Access Only.
router.patch(
	"/:orderId",
	authenticationMiddleware,
	authorizationPermission,
	updateOrder
);

module.exports = router;
