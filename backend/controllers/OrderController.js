//This sends order request to backend
//@desc create new order
//@ route POST api/orders
//@desc Private
import asyncHandler from "express-async-handler";
import Order from "./../models/OrderModel.js";
//This would be run in the route
const addOrderItems = asyncHandler(async (req, res) => {
	//The orderItems request from frontend, they are in the order model so the frontend's request has to match it explicitly
	const {
		orderItems,
		shippingAddress,
		paymentMethod,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
	} = req.body;
	//make sure that orderItems is not empty
	if (orderItems && orderItems.length === 0) {
		res.status(400);
		throw new Error("No order items");
		return;
	} else {
		const order = new Order({
			//Items that would be created as order
			orderItems,
			user: req.user._id, //This is the user id making the request
			shippingAddress,
			paymentMethod,
			itemsPrice,
			taxPrice,
			shippingPrice,
			totalPrice,
		});
		//This user order created is now saved in the database
		const createdOrder = await order.save();
		//201 status means that an item has been successfully created
		res.status(201).json(createdOrder);
	}
});

//Updating order to paid
//@ DESC UPDATE order to paid
//GET /api/orders/:id/pay
const updateOrderToPaid = asyncHandler(async (req, res) => {
	//Getting only an individual order then putting it in the user passed in the order
	const order = await Order.findById(req.params.id);
	//if we get an orderId in the backend
	if (order) {
		order.isPaid = true;
		order.paidAt = Date.now();
		order.status;
		order.paymentResult = {
			//from paypal's api, other payment solution may have a different format
			id: req.body.id,
			status: req.body.status,
			update_time: req.body.update_time,
			email_address: req.body.payer.email_address,
		};
		const updatedOrder = await order.save();
		res.json(updatedOrder);
	} else {
		res.status(404);
		throw new Error("Order not found");
	}
});

const getOrderById = asyncHandler(async (req, res) => {
	//Getting only an individual order then putting it in the user passed in the order
	const order = await Order.findById(req.params.id).populate(
		"user",
		"name email"
	);

	if (order) {
		res.json(order);
	} else {
		res.status(404);
		throw new Error("Order not found");
	}
});

//Listing order on the profile screen frontend
//@ DESC GET order to paid
//GET /api/orders/myorders
const getMyOrders = asyncHandler(async (req, res) => {
	//Getting only an individual order then putting it in the user passed in the order
	//find means getting everything; user is the user with the order
	const orders = await Order.find({ user: req.user._id });
	res.json(orders);
});

//Listing order on the profile screen frontend for Admin
//@ DESC GET order to paid
//GET /api/orders/orders
//@desc PRIVATE/Admin
const getOrders = asyncHandler(async (req, res) => {
	//find means getting everything; user is the user with the order
	// we wanna get the name and id of user associated with that order
	const orders = await Order.find({}).populate("user ", "id name");

	res.json(orders);
});

//Listing order on the profile screen frontend for Admin
//@ DESC GET order to paid
//GET /api/orders/:id/deliver
//@desc PRIVATE/Admin
const updateOrders = asyncHandler(async (req, res) => {
	//find means getting everything; user is the user with the order
	// we wanna get the name and id of user associated with that order
	const order = await Order.find({}).populate("user ", "id name");
	//if the order is available, delivered should be updted to true when you hit this endpoint
	if (order) {
		order.isDelivered = true;
		order.deliveredAt = Date.now();
	}

	res.json(orders);
});

export {
	addOrderItems,
	getOrderById,
	updateOrderToPaid,
	getMyOrders,
	getOrders,
	updateOrders,
};
