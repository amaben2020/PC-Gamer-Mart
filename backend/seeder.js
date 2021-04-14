import users from "./Data/users.js";
// import products from "./Data/products.js";
import User from "./models/UserModel.js";
import Product from "./models/ProductModel.js";
import Order from "./models/OrderModel.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import products from "./Data/products.js";
dotenv.config();
connectDB();

const importAllData = async () => {
	try {
		await Order.deleteMany();
		await User.deleteMany();
		await Product.deleteMany();
		//passing in the users we created into our user model
		const createdUsers = await User.insertMany(users);
		//making admin user the product id, the admin user is the first user in users array
		const adminUser = createdUsers[0]._id;
		//adding admin user as id of each product in product.js
		const sampleProducts = products.map((product) => {
			return { ...product, user: adminUser };
		});
		await Product.insertMany(sampleProducts);
		console.log("Data imported successfully!");
		process.exit();
	} catch (error) {
		console.log(`${error}`);
		process.exit(1);
	}
};

const destroyAllData = async () => {
	try {
		await Order.deleteMany();
		await User.deleteMany();
		await Product.deleteMany();

		console.log("Data destroyed!".red.inverse);
		process.exit();
	} catch (error) {
		console.log(`${error}`.grey.inverse);
		process.exit(1);
	}
};
//deleting the data using -d
if (process.argv[2] === "-d") {
	destroyAllData();
} else {
	importAllData();
}
