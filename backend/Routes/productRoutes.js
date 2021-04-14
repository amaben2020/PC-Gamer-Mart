import express from "express";
import {
	getProductById,
	getProducts,
	deleteProduct,
	updateProduct,
	createProduct,
	createProductReview,
	getTopRatedProducts,
} from "./../controllers/ProductController.js";
import { protect, admin } from "./../middleware/authMiddleware.js";
const router = express.Router();

//@desc Fetch all products
//@desc GET /api/products
//@access PUBLIC anyone
router.route("/").get(getProducts).post(protect, admin, createProduct);

//@desc Fetch single products
//@desc GET /api/products/3
//@access PUBLIC anyone
router
	.route("/:id")
	.get(getProductById)
	.delete(protect, admin, deleteProduct)
	.put(protect, admin, updateProduct);

router.route("/:id/reviews").post(protect, createProductReview);
router.get("/top", getTopRatedProducts);
export default router;
