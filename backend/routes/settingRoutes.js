import express from "express";

import {
  getSettings,
  updateSettings,
} from "../controllers/settingController.js";

import { protectAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", getSettings);
router.put("/", protectAdmin, updateSettings);

export default router;
