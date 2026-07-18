import express from "express";

import {
  createOrder,
  getOrders,
  getCustomers,
  trackOrder,
  getOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

import { protectAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Customer
router.post("/", createOrder);
router.get("/track/:identifier", trackOrder);

// Admin
router.get("/", protectAdmin, getOrders);
router.get("/customers", protectAdmin, getCustomers);
router.get("/:id", protectAdmin, getOrder);
router.put("/:id/status", protectAdmin, updateOrderStatus);
router.delete("/:id", protectAdmin, deleteOrder);

export default router;
