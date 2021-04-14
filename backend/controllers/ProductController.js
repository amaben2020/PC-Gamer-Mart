import Product from "./../models/ProductModel.js";
import asyncHandler from "express-async-handler";
//@desc Fetch all products
//@desc GET /api/products
//@access PUBLIC anyone

const getProducts = asyncHandler(async (req, res) => {
	const pageSize = 10; // items rendered on a page at a given time
	const page = Number(req.query.pageNumber) || 1;

	const keyword = req.query.keyword
		? {
				name: {
					$regex: req.query.keyword, // iph shoule be iphone
					$options: "i", //case insensitive
				},
		  }
		: {};
	const count = await Product.countDocuments({ ...keyword });
	const products = await Product.find({ ...keyword })
		.limit(pageSize)
		.skip(pageSize * (page - 1));
	res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//@desc Fetch single products
//@desc GET /api/products/3
//@access PUBLIC anyone
const getProductById = asyncHandler(async (req, res) => {
	// if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
	// 	// Yes, it's a valid ObjectId, proceed with `findById` call.
	// }
	const product = await Product.findById(req.params.id);
	if (product) {
		res.json(product);
	} else {
		res.status(404);
		throw new Error("Product not found");
	}
});

//@desc DELETE single product
//@desc GET /api/products/:id
//@access PRIVATE/Admin
const deleteProduct = asyncHandler(async (req, res) => {
	//Get the product from frontend by its id
	const product = await Product.findById(req.params.id);
	if (product) {
		await product.remove();
		res.json({ message: "Product successfully removed" });
	} else {
		res.status(404);
		throw new Error("Product not found");
	}
});

//@desc CREATE single product by admin
//@desc POST /api/products
//@access PRIVATE/Admin :You must have an admin token to do this
const createProduct = asyncHandler(async (req, res) => {
	//Here, we instantiate a new product
	//user : req.user._id ; The logged in admin user's id
	//These fields must be same as database schema
	const product = new Product({
		name: "Sample name",
		price: 0,
		user: req.user._id,
		image: "/images/sample.jpg",
		brand: "sample brand",
		category: "sample category",
		countInStock: 0,
		numReviews: 0,
		description: "Sample description",
	});
	//after creating product in the database, we need to store it in a variable so it could be rendered on the frontend via the route
	const createdProduct = await product.save();
	if (product) {
		res.json(createdProduct);
	} else {
		res.status(404);
		throw new Error("Product not found");
	}
});

//@desc UPDATE single product by admin
//@desc PUT /api/products/:id
//@access PRIVATE/Admin
const updateProduct = asyncHandler(async (req, res) => {
	//extracting the form data for body from the frontend
	const {
		name,
		price,
		description,
		countInStock,
		brand,
		category,
		image,
	} = req.body;
	//Getting the product properties by its id
	const product = await Product.findById(req.params.id);

	//editing/updating the product in database
	if (product) {
		product.name = name;
		product.brand = brand;
		product.countInStock = countInStock;
		product.category = category;
		product.description = description;
		product.price = price;
		product.image = image;

		//saving the updated products to the database
		const updatedProduct = await product.save();
		//displaying on the frontend via Object
		res.json(updatedProduct);
	} else {
		res.status(404);
		throw new Error("Product not created");
	}
});

//@desc Posting a review single product by admin
//@desc POST /api/products/:id/reviews
//@access PRIVATE
const createProductReview = asyncHandler(async (req, res) => {
	//extracting the form data for body from the frontend
	const { rating, comment } = req.body;
	//Getting the product properties by its id
	const product = await Product.findById(req.params.id);

	//editing/updating the product in database
	if (product) {
		const alreadyReviewed = product.reviews.find(
			(review) => review.user.toString() === req,
			user._id.toString()
		);

		if (alreadyReviewed) {
			res.status(400);
			throw new Error("Product already reviewed");
		}
		//if the user didnt review
		const review = {
			name: req.user.name,
			rating: Number(rating),
			comment,
			user: req.user._id,
		};
		//put the user review in  the db reviews array [ ]
		product.reviews.push(review);
		product.numReviews = product.reviews.length;
		//finding the average for ratings
		product.rating = product.reviews.reduce(
			(acc, item) => item.rating + acc,
			0 / products.reviews.length
		);

		res.status(201).json({ message: "Review added" });

		await product.save();
	} else {
		res.status(404);
		throw new Error("Review unsuccessful");
	}
});

//@desc Getting the top rated products
//@desc GET /api/products/top
//@access PUBLIC
const getTopRatedProducts = asyncHandler(async (req, res) => {
	const products = await Product.find({}).sort({ rating: -1 }).limit(3);

	res.json(products);
});

export {
	getProductById,
	getProducts,
	deleteProduct,
	updateProduct,
	createProduct,
	createProductReview,
	getTopRatedProducts,
};
