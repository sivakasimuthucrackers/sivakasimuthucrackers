import express from "express";
import multer from "multer";
import path from "path";

import { protectAdmin } from "../middleware/adminAuth.js";
import {
  importProductsFromExcel,
  getCurrentPriceList,
} from "../controllers/importController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),

  fileFilter(req, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();

    if (extension === ".xlsx" || extension === ".xls") {
      callback(null, true);
      return;
    }

    callback(new Error("Only Excel files are allowed"), false);
  },

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const acceptExcelFile = [
  protectAdmin,

  upload.fields([
    { name: "excelFile", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),

  (req, res, next) => {
    req.file =
      req.files?.excelFile?.[0] ||
      req.files?.file?.[0] ||
      null;

    next();
  },

  importProductsFromExcel,
];

// Public route for the main website to get latest Cloudinary Excel URL.
router.get("/price-list", getCurrentPriceList);

router.post("/", ...acceptExcelFile);
router.post("/products", ...acceptExcelFile);

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Excel file size must be 10 MB or less"
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
