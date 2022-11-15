require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

// Docs related packages
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocs = YAML.load("./swagger.yaml");

app.set("trust proxy", 1);

// Security Packages
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const connectDB = require("./db/connectDB");
const notFoundMiddleware = require("./middlewares/notFound");
const errorHandlerMiddleware = require("./middlewares/errorHandler");

// Routes Imports
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const orderRoute = require("./routes/orderRoute");
const checkoutRoute = require("./routes/checkoutRoute");

app.use(express.static("./public"));
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(mongoSanitize());

app.get("/", function (req, res) {
	const fontFamily =
		"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;";
	res.send(
		`<h1 style="${fontFamily}"> E-Commerce Api </h1> <a href="/api-docs" style="${fontFamily}">Api Docs</a>`
	);
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/checkout", checkoutRoute);

// These below two middlewares should always be placed in last.
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

app.listen(port, async function () {
	try {
		await connectDB(process.env.MONGO_URI);
		console.log(`Server is Listening on port ${port}... `);
	} catch (error) {
		console.log(error);
	}
});
