import express from "express";

import {
  getActiveBanners,
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../controllers/bannerController.js";

import { protectAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Public
router.get("/active", getActiveBanners);

// Admin
router.get("/", protectAdmin, getBanners);
router.post("/", protectAdmin, createBanner);
router.put("/:id", protectAdmin, updateBanner);
router.delete("/:id", protectAdmin, deleteBanner);

export default router;
