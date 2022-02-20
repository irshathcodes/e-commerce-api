const Order = require("../models/Order");
const Product = require("../models/Product");
const CustomError = require("../errors/CustomError");

async function createOrder(req, res) {
	const { cartItems } = req.body;

	const shippingfee = 30;
	const tax = 12;

	if (!cartItems || !shippingfee || !tax)
		throw new CustomError(400, "Please provide the required fields");

	let orderItems = [];
	let subtotal = 0;

	for (let item of cartItems) {
		if (!item || typeof item.quantity !== "number" || item.quantity < 1)
			throw new CustomError(400, "Please provide the required fields");

		const dbProduct = await Product.findOne({ _id: item.product });

		if (!dbProduct)
			throw new CustomError(404, `No product found with id ${item.product}`);

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

	const checkingUniqueOrders = [
		...new Set(
			orderItems.map((item) => {
				return item.product.toString();
			})
		),
	];

	// Checking if items in the cart are unique products, not duplicated ones.
	if (orderItems.length !== checkingUniqueOrders.length)
		throw new CustomError(
			400,
			"Duplicate products are not allowed in cartItems array"
		);

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

async function addShippingDetails(req, res) {
	const { orderId } = req.body;

	if (!orderId) throw new CustomError(400, "Order Id is required");

	const order = await Order.findOneAndUpdate(
		{ user: req.user, _id: orderId },
		{ shippingDetails: req.body },
		{ new: true, runValidators: true }
	);

	if (!order) throw new CustomError(404, `No order found with id ${orderId}`);

	res.status(201).json({ order });
}

async function getAllOrders(req, res) {
	const orders = await Order.find({});

	res.status(200).json({ nbHits: orders.length, orders });
}

module.exports = { createOrder, addShippingDetails, getAllOrders };
