import User from "./../models/UserModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "./../utils/generateToken.js";

//@desc Fetch all products
//@desc GET /api/products
//@access PUBLIC anyone
//This authUser function simply logsIn a user with the email and password fields and the email has to be matched with that in the database. If the user exists and the password matches the hashed password in the database, give it a token that it would use to login, if the user doesnt exist in the database, throw an error.
const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	//Finding the user with that email
	const user = await User.findOne({ email });
	// console.log(user); // id, name, email, isAdmin, token
	//if the user from the User schema matches the
	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		});
	} else {
		res.status(401);
		throw new Error("Invalid Email or Password");
	}
});

//This fn would enable viewing the user's profile if authenticated or possess a token
const getUserProfile = asyncHandler(async (req, res) => {
	//get the user by its id
	const user = await User.findById(req.user._id);
	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

//@Desc Registering a user a user
//@route POST /api/users
//@access Private
//This registers a new user
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;
	//If the name, email exists in database
	const userExists = await User.findOne({ email });

	const user = await User.create({
		name,
		email,
		password,
	});
	// when the user registers, create the user in the database with token
	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		});
	} else {
		//if any mistake in the user field input, throw an error
		res.status(400);
		throw new Error("Invalid User Data");
	}

	if (userExists) {
		res.status(400);
		throw new Error("User already exists");
	}
});

//@Desc Enables a user updates itself
//@route PUT /api/users/:id
//@access Private/Admin
//This updates a user's profile using PUT
const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);
	//if a user exists, update the name and email
	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
	}
	//updating user password, let user's password be whatever the user enters
	if (req.body.password) {
		user.password = req.body.password;
	}
	//save the update in our database
	const updatedUser = await user.save();
	console.log(updatedUser);
	res.json({
		_id: updatedUser._id,
		name: updatedUser.name,
		isAdmin: updatedUser.isAdmin,
		token: generateToken(updatedUser._id),
	});
});

//This fn would enable the ADMIN view all users in the DATABASE. It would also be a protected route
const getUsers = asyncHandler(async (req, res) => {
	//get the all users in DB with all their properties.
	const users = await User.find({});
	if (users) {
		//never put your res.json in an object, it changes the data structure
		res.json(users);
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

//@Desc Deleting a user by admin
//@route DELETE /api/users/:id
//@access Private/Admin
//deleting a user
const deleteUser = asyncHandler(async (req, res) => {
	//get the user you wanna delete by its id.
	const user = await User.findById(req.params.id);
	if (user) {
		//deleting the user
		await user.remove();
		res.json({ message: "User removed successfully" });
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

//@Desc getting a user for the Admin to update
//@route GET /api/users/:id
//@access Private/Admin
//editing a user; you first need to get the user by ID
const getUserById = asyncHandler(async (req, res) => {
	//get the all users in DB by their id.
	const user = await User.findById(req.params.id).select("-password");
	if (user) {
		//never put your res.json in an object, it changes the data structure
		res.json(user);
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

//@Desc Updating a user
//@route PUT /api/users/:id
//  http://localhost:9000/api/users/6060767188f29d2030440c22 for fromtend
//@access Private/Admin
//editing a user; you first need to get the user by ID; now you update the user
const updateAnyUser = asyncHandler(async (req, res) => {
	//get a user in DB by the id from frontend.
	const user = await User.findById(req.params.id);
	//if a user exists, update the name and email plus the admin role
	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		user.isAdmin = req.body.isAdmin;
	}
	//save the update in our database
	const updatedUser = await user.save();

	res.json({
		_id: updatedUser._id,
		name: updatedUser.name,
		isAdmin: updatedUser.isAdmin,
	});
});

//This fn would enable viewing the user's profile if authenticated or possess a token
const getUserProfileForAdmin = asyncHandler(async (req, res) => {
	//get the user id in the /:id
	const user = await User.findById(req.params.id);
	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error("User not found");
	}
});

export {
	authUser,
	getUserProfile,
	registerUser,
	updateUserProfile,
	getUsers,
	deleteUser,
	getUserById,
	updateAnyUser,
	getUserProfileForAdmin,
};
