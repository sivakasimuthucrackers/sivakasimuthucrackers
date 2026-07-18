import express from "express";

import {
  loginAdmin,
  dashboard,
  recentOrders,
  lowStockProducts,
  bestSellingProducts,
  orderSummary,
  salesReport,
} from "../controllers/adminController.js";

import { protectAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", loginAdmin);

router.get("/dashboard", protectAdmin, dashboard);

router.get("/recent-orders", protectAdmin, recentOrders);

router.get("/low-stock", protectAdmin, lowStockProducts);

router.get("/best-selling", protectAdmin, bestSellingProducts);

router.get("/order-summary", protectAdmin, orderSummary);

router.get("/sales-report", protectAdmin, salesReport);

export default router;