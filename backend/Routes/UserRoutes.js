import express from "express";
import {
	authUser,
	getUserProfile,
	registerUser,
	updateUserProfile,
	getUsers,
	deleteUser,
	updateAnyUser,
	getUserProfileForAdmin,
} from "./../controllers/UserControllers.js";
import { protect, admin } from "./../middleware/authMiddleware.js";
const router = express.Router();

//register a new user
//getting all users via chaining to the '/' route
// localhost://9000/api/users
router.route("/").post(registerUser).get(protect, admin, getUsers);
//send a post request to login with email and password
router.post("/login", authUser);

// router.get("/profile", protect,  getUserProfile);
//update a user's profile, it is a protected Route
router
	.route("/profile")
	.get(protect, getUserProfile)
	.put(protect, updateUserProfile);
router.route("/profile/:id").get(protect, admin, getUserProfileForAdmin);
router
	.route("/:id")
	.delete(protect, admin, deleteUser)
	.put(protect, admin, updateAnyUser);

export default router;
