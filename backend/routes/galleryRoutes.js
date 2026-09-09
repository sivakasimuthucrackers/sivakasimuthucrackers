import express from "express";
import multer from "multer";

import {
  getActiveGalleryItems,
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../controllers/galleryController.js";

import { protectAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Keep file in memory, then send it directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP, GIF, MP4, WEBM and MOV files are allowed"
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    // 100 MB to support gallery videos.
    // Cloudinary/account plan limits still apply.
    fileSize: 100 * 1024 * 1024,
  },
});

/* ---------- Public Routes ---------- */

// Get active gallery for website
router.get("/active", getActiveGalleryItems);

/* ---------- Admin Routes ---------- */

// Get all gallery items
router.get("/", protectAdmin, getGalleryItems);

// Upload image/video and create gallery item
router.post(
  "/",
  protectAdmin,
  upload.single("media"),
  createGalleryItem
);

// Update details and optionally replace image/video
router.put(
  "/:id",
  protectAdmin,
  upload.single("media"),
  updateGalleryItem
);

// Delete gallery item + Cloudinary file
router.delete("/:id", protectAdmin, deleteGalleryItem);

export default router;
