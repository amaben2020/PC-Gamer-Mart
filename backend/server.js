import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./Routes/productRoutes.js";
import UserRoutes from "./Routes/UserRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import orderRoutes from "./Routes/OrderRoutes.js";
import UploadRoutes from "./Routes/UploadRoutes.js";
import path from "path";
import morgan from "morgan";
const app = express();

dotenv.config();

connectDB();
//middleware that allows posting JSON data
app.use(express.json());

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use("/api/products", productRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", UploadRoutes);

//points to the uploads directory
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//creating a route that sends the paypal's client_id to frontend
app.get("/api/config/paypal", (req, res) =>
	res.send(process.env.PAYPAL_CLIENT_ID)
);

//setting the build folder as static file i.e server rendering
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/build")));

	app.get("*", (req, res) =>
		res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
	);
} else {
	app.get("/", (req, res) => {
		res.send("API is running....");
	});
}

app.use(notFound, errorHandler);

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
	console.log(
		`Server is running in ${process.env.NODE_ENV} on ${PORT}`.yellow.bold
	);
});
