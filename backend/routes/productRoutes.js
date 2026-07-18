import express from "express";

import {
  getProducts,
  getLatestProducts,
  getProductById,
  getProductBySlug,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protectAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/latest", getLatestProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);

// Admin routes
router.post("/", protectAdmin, addProduct);
router.put("/:id", protectAdmin, updateProduct);
router.delete("/:id", protectAdmin, deleteProduct);

export default router;