const express = require("express");
const router = express.Router();

const {
	createOrder,
	addShippingDetails,
	getAllOrders,
} = require("../controllers/orderController");
const {
	authenticationMiddleware,
	authorizationPermission,
} = require("../middlewares/authentication");

router
	.route("/")
	.post(authenticationMiddleware, createOrder)
	.get(authenticationMiddleware, authorizationPermission, getAllOrders);
router.post("/:orderId", authenticationMiddleware, addShippingDetails);

module.exports = router;
