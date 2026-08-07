import express from "express";
import multer from "multer";

import cloudinary from "../config/cloudinary.js";
import { protectAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, callback) {
    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
      return;
    }

    callback(
      new Error("Only JPG, JPEG, PNG and WEBP images are allowed")
    );
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

function uploadBufferToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "muthu-crackers/products",
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

router.post(
  "/product-image",
  protectAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select an image",
        });
      }

      const result = await uploadBufferToCloudinary(req.file.buffer);

      return res.json({
        success: true,
        message: "Image uploaded successfully",
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });
    } catch (error) {
      console.error("Cloudinary product image upload failed:", error);

      return res.status(500).json({
        success: false,
        message: error.message || "Unable to upload product image",
      });
    }
  }
);

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Image size must be 5 MB or less"
          : error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next();
});

export default router;
