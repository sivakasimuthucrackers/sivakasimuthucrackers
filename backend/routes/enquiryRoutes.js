import express from "express";

import {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} from "../controllers/enquiryController.js";

import { protectAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/", createEnquiry);

router.get("/", protectAdmin, getEnquiries);
router.put("/:id/status", protectAdmin, updateEnquiryStatus);
router.delete("/:id", protectAdmin, deleteEnquiry);

export default router;