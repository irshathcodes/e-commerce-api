const Order = require("../models/Order");
const Product = require("../models/Product");
const CustomApiError = require("../errors/CustomApiError");

async function createOrder(req, res) {
	const { cartItems, shippingfee, tax } = req.body;

	if (!cartItems || !shippingfee || !tax)
		throw new CustomApiError(400, "Please provide the required fields");

	let orderItems = [];
	let subtotal = 0;

	for (let item of cartItems) {
		if (!item || typeof item.quantity !== "number" || item.quantity < 1)
			throw new CustomApiError(400, "Please provide the required fields");

		const dbProduct = await Product.findOne({ _id: item.product });

		if (!dbProduct)
			throw new CustomApiError(404, `No product found with id ${item.product}`);

		const { _id, name, image, price } = dbProduct;

		const singleProductDetails = {
			name,
			image,
			price,
			quantity: item.quantity,
			product: _id,
		};

		// Adding cart items into this array
		orderItems = [...orderItems, singleProductDetails];

		// for each iteration the subtotal will be calculated.
		subtotal += price * item.quantity;
	}

	const total = subtotal + tax + shippingfee;

	// Creating the order.
	const order = await Order.create({
		tax,
		shippingfee,
		subtotal,
		total,
		orderItems,
		user: req.user,
	});

	res.status(201).json(order);
}

module.exports = { createOrder };
