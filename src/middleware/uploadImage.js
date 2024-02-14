import multer from "multer";
// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination folder where uploaded files will be stored
    cb(null, "../public/temp");
  },
  filename: function (req, file, cb) {
    // Define the file name for the uploaded file
    cb(null, file.originalname + "-" + Date.now());
  },
});

// Initialize multer
const upload = multer({
  storage: storage,
  // Define file filter to accept only image files
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      // Reject non-image files
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

// Middleware function to handle image upload
const uploadImage = upload.single("image"); // 'image' is the name attribute in the form

export default uploadImage;
