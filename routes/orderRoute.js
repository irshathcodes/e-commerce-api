const express = require("express");
const router = express.Router();

const {
	createOrder,
	addShippingDetails,
} = require("../controllers/orderController");
const { authenticationMiddleware } = require("../middlewares/authentication");

router.route("/").post(authenticationMiddleware, createOrder);
router.post("/:orderId", addShippingDetails);

module.exports = router;
