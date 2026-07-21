import express from "express";

import { downloadInvoice } from "../controllers/invoiceController.js";

const router = express.Router();

router.get("/:orderId/download", downloadInvoice);

export default router;
