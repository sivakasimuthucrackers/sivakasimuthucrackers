const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Upload Folder
const uploadPath = path.join(__dirname, "..", "uploads", "gallery");

// Create folder automatically
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Storage
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

// Allow only images
const fileFilter = (req, file, cb) => {

    const allowedTypes = /jpg|jpeg|png|webp/;

    const extension = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    const mimeType = allowedTypes.test(file.mimetype);

    if (extension && mimeType) {
        return cb(null, true);
    }

    cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed"));

};

// Upload configuration
const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }

});

module.exports = upload;