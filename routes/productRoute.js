const express = require("express");
const Router = express.Router();

const authenticationMiddleware = require("../middlewares/authentication");
const { getAllProducts } = require("../controllers/productController");

Router.route("/").get(authenticationMiddleware, getAllProducts);

module.exports = Router;
