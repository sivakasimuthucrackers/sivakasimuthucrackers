const express = require("express");
const { downloadInvoice } = require("../controllers/invoiceController");

const router = express.Router();

router.get("/:orderId/download", downloadInvoice);

module.exports = router;
