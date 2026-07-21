import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";

import Order from "../models/Order.js";
import { renderEstimateInvoice } from "../utils/invoiceTemplate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function downloadInvoice(req, res) {
  try {
    const { orderId } = req.params;

    let order = null;

    if (/^[0-9a-fA-F]{24}$/.test(orderId)) {
      order = await Order.findById(orderId).lean();
    }

    if (!order) {
      order = await Order.findOne({
        $or: [
          { orderNumber: orderId },
          { invoiceNumber: orderId },
          { estimateNumber: orderId },
        ],
      }).lean();
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const fileNumber =
      order.estimateNumber ||
      order.invoiceNumber ||
      order.orderNumber ||
      order._id;

    const doc = new PDFDocument({
      size: "A4",
      margin: 0,
      bufferPages: true,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Estimate-${fileNumber}.pdf"`
    );

    doc.pipe(res);

    renderEstimateInvoice(doc, order, {
      logoPath: path.join(__dirname, "../utils/logo.png"),
      watermarkPath: path.join(__dirname, "../utils/logo.png"),
    });

    doc.end();
  } catch (error) {
    console.error("Invoice generation failed:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Unable to generate invoice",
        error: error.message,
      });
    }

    res.end();
  }
}
