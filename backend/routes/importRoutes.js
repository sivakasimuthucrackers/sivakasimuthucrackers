import express from "express";
import multer from "multer";
import path from "path";

import { protectAdmin } from "../middleware/adminAuth.js";
import { importProductsFromExcel } from "../controllers/importController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "uploads/");
  },

  filename(req, file, callback) {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (extension === ".xlsx" || extension === ".xls") {
    callback(null, true);
  } else {
    callback(new Error("Only Excel files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
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

router.post("/", ...acceptExcelFile);
router.post("/products", ...acceptExcelFile);

export default router;
