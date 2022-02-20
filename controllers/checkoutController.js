const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Order = require("../models/Order");
const CustomError = require("../errors/CustomError");

async function createCheckout(req, res) {
	const { orderId } = req.body;

	if (!orderId) throw new CustomError(400, "Order Id is required");

	const order = await Order.findOne({ user: req.user, _id: orderId });

	if (!order) throw new CustomError(404, `No order found with id ${orderId}`);

	const line_items = order.orderItems.map((item) => {
		const { quantity, name, price } = item;
		return {
			quantity,
			price_data: {
				currency: "inr",
				unit_amount: price * 100,
				product_data: {
					name,
				},
			},
		};
	});

	const session = await stripe.checkout.sessions.create({
		mode: "payment",
		payment_method_types: ["card"],
		line_items,
		success_url: `${process.env.CLIENT_DOMAIN}/payment/success`,
		cancel_url: `${process.env.CLIENT_DOMAIN}/payment/cancel`,
	});

	res.json({ url: session.url });
}

module.exports = createCheckout;
