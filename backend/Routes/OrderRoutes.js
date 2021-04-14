import express from "express";
import {
	addOrderItems,
	updateOrderToPaid,
	getOrderById,
	getMyOrders,
	getOrders,
	updateOrders,
} from "./../controllers/OrderController.js";
import { protect, admin } from "./../middleware/authMiddleware.js";
const router = express.Router();

//create a new order but you must be logged in first to do that
router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
//route for updating order to paid
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, admin, updateOrders);

export default router;
