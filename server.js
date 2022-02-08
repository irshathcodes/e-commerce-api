require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./db/connectDB");
const notFoundMiddleware = require("./middlewares/notFound");
const errorHandlerMiddleware = require("./middlewares/errorHandler");
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");

app.get("/", function (req, res) {
	res.send("<h1> E-Commerce Api </h1>");
});

app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/products", productRoute);

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
