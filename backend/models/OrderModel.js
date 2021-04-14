import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
	{
		//user that buys the product
		user: {
			//The type here means it has a relationship with the User model
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		orderItems: [
			{
				name: {
					type: String,
					required: true,
				},
				qty: {
					type: Number,
					required: true,
				},
				image: {
					type: String,
					required: true,
				},
				price: {
					type: Number,
					required: true,
				},
				product: {
					//should reference the product the user ordered
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					ref: "Product",
				},
				shippingAddress: {
					address: {
						type: String,
					},
					city: {
						type: String,
					},
					postalCode: {
						type: String,
					},
					state: {
						type: String,
					},
					country: {
						type: String,
					},
					lga: {
						type: String,
					},
					homeLandmark: {
						type: String,
					},
				},
				paymentMethod: {
					type: String,
				},
				//from PAYPAL API
				paymentResult: {
					id: {
						type: String,
					},
					status: {
						type: String,
					},
					update_time: {
						type: String,
					},
					email_address: {
						type: String,
					},
				},
				taxPrice: {
					type: Number,
					required: true,
					default: 0.0,
				},
				vat: {
					type: Number,
					required: true,
					default: 0.0,
				},
				shippingPrice: {
					type: Number,
					required: true,
					default: 0.0,
				},
				totalPrice: {
					type: Number,
					required: true,
					default: 0.0,
				},
				isPaid: {
					type: Boolean,
					required: true,
					default: false,
				},
				paidAt: {
					type: Date,
				},
				isDelivered: {
					type: Boolean,
					required: true,
					default: false,
				},
				deliveredAt: {
					type: Date,
				},
			},
		],
	},
	{ timestamps: true }
);

//first arguement is the model, second arg is the schema
const Order = mongoose.model("Order", orderSchema);

export default Order;
