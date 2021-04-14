import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "./../models/UserModel.js";

//THIS MIDDLEWARE ONLY ALLOWS YOU VIEW A ROUTE WITH TOKEN
const protect = expressAsyncHandler(async (req, res, next) => {
	let token;
	//console.log(req.headers.authorization); Gives the token
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		// console.log("token found");
		try {
			//Get/Extract only the token value i.e Bearer jvnjnao9i0v3n30n39wn39w0[1] make sure not to make the token a const so it doesnt break the code.
			token = req.headers.authorization.split(" ")[1];
			//verifies if the token matches with the jwt secret in .env
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			//the user's password should not be included in the response.json
			req.user = await User.findById(decoded.id).select("-password");
			next();
		} catch (error) {
			console.error(error);
			res.status(401);
			throw new Error("Not authorized, token failed");
		}
	}
	if (!token) {
		res.status(401);
		throw new Error("Not authorized, no token");
	}
});

//creating the admin middleware that enables only admins view a route
const admin = expressAsyncHandler(async (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		next();
	} else {
		res.status(401);
		throw new Error("Not authorized to view this page; Not an Admin");
	}
});

export { protect, admin };
