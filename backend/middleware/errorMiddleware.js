import express from "express";
const app = express();
//Middleware errorHandling

export const errorHandler = app.use((err, req, res, next) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(statusCode);
	res.json({
		message: err.message,
		stack: process.nextTick.NODE_ENV === "production" ? null : err.stack,
	});
});

//if a url is  not found
export const notFound = app.use((req, res, next) => {
	const error = new Error(`  Not Found - ${req.originalUrl}`);
	res.status(404);
	next(error);
});
