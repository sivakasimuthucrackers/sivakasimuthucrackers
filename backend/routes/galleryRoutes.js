import express from "express";

import {
  getActiveGalleryItems,
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../controllers/galleryController.js";

import { protectAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

/* ---------- Public Routes ---------- */

// Get active gallery for website
router.get("/active", getActiveGalleryItems);

/* ---------- Admin Routes ---------- */

// Get all gallery items
router.get("/", protectAdmin, getGalleryItems);

// Add gallery item
router.post("/", protectAdmin, createGalleryItem);

// Update gallery item
router.put("/:id", protectAdmin, updateGalleryItem);

// Delete gallery item
router.delete("/:id", protectAdmin, deleteGalleryItem);

export default router;