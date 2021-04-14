import express from "express";
import multer from "multer";
import path from "path";
const router = express.Router();

//creating the config file tht saves image links to your uploads folder
const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, "uploads/");
	},
	//This enables you use any filename you want
	filename(req, file, cb) {
		cb(
			null,
			`${file.fieldname} - ${Date.now()} ${path.extname(file.originalname)}`
		);
	},
});
//configuring the only filetypes or extensions that are allowed
function checkFileType(file, cb) {
	const filetypes = /jpg|jpeg|png/;
	//This is true if the filetype matches the filetypes
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	//mimetype i.e JPEG is an image
	const mimetype = filetypes.test(file.mimetype);
	if (extname && mimetype) {
		return cb(null, true);
	} else {
		cb("Images Only!!");
	}
}

const upload = multer({
	storage,
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	},
});
//uploading only a single image file
router.post(
	"/",
	upload.single("image", (req, res) => {
		res.send(`/${req.file.path}`);
	})
);

export default router;
