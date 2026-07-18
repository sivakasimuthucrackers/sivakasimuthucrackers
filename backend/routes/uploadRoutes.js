import express from "express";
import multer from "multer";
import path from "path";

import { protectAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads/");
  },

  filename: function (req, file, callback) {
    const extension = path.extname(file.originalname);
    const safeName = path
      .basename(file.originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    callback(
      null,
      `${Date.now()}-${safeName}${extension.toLowerCase()}`
    );
  },
});

const fileFilter = function (req, file, callback) {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new Error("Only JPG, JPEG, PNG and WEBP images are allowed"),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/product-image",
  protectAdmin,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image",
      });
    }

    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl,
    });
  }
);

export default router;