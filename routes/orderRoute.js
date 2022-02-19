const express = require("express");
const router = express.Router();

const { createOrder } = require("../controllers/orderController");
const { authenticationMiddleware } = require("../middlewares/authentication");

router.route("/").post(authenticationMiddleware, createOrder);

module.exports = router;
