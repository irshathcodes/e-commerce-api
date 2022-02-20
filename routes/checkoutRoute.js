const express = require("express");
const router = express.Router();

const { authenticationMiddleware } = require("../middlewares/authentication");
const createCheckout = require("../controllers/checkoutController");

router.post("/", authenticationMiddleware, createCheckout);

module.exports = router;
