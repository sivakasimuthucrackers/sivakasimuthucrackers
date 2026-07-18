import express from "express";

import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  generateCategoriesFromProducts,
} from "../controllers/categoryController.js";

import { protectAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", getCategories);

router.post("/", protectAdmin, addCategory);

router.post(
  "/generate-from-products",
  protectAdmin,
  generateCategoriesFromProducts
);

router.put("/:id", protectAdmin, updateCategory);
router.delete("/:id", protectAdmin, deleteCategory);

export default router;