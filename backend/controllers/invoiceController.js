// Invoice Controller
// Place this file in: backend/controllers/invoiceController.js

const PDFDocument = require("pdfkit");
const Order = require("../models/Order");

exports.downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const doc = new PDFDocument({ size: "A4", margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(22).fillColor("#d81b60")
      .text("SIVAKASI MUTHU CRACKERS");

    doc.moveDown();
    doc.fontSize(10).fillColor("black");
    doc.text("Opp AJ Polytechnic College");
    doc.text("Near Sankari Mahal, Sattur - Sivakasi Road, Konampatti");
    doc.text("Phone : +91 96003 33302");
    doc.text("WhatsApp : +91 70104 00258");
    doc.text("Email : sivakasimuthucrackers@gmail.com");

    doc.moveDown();
    doc.fontSize(18).text("INVOICE");

    doc.moveDown();
    doc.fontSize(11);
    doc.text(`Invoice No : INV-${order._id.toString().slice(-6).toUpperCase()}`);
    doc.text(`Order ID    : ${order._id}`);
    doc.text(`Date        : ${new Date(order.createdAt).toLocaleDateString("en-IN")}`);

    doc.moveDown();
    doc.font("Helvetica-Bold").text("Customer Details");
    doc.font("Helvetica");
    doc.text(`Name    : ${order.customerName || order.name || "-"}`);
    doc.text(`Phone   : ${order.phone || "-"}`);
    doc.text(`Address : ${order.address || "-"}`);

    doc.moveDown();

    const startY = doc.y;

    doc.font("Helvetica-Bold");
    doc.text("Product", 40, startY);
    doc.text("Qty", 300, startY);
    doc.text("Price", 360, startY);
    doc.text("Total", 460, startY);

    doc.moveTo(40, startY + 18).lineTo(550, startY + 18).stroke();

    let y = startY + 30;
    let grandTotal = 0;

    (order.items || []).forEach((item) => {
      const qty = Number(item.quantity || 1);
      const price = Number(item.price || item.offerPrice || 0);
      const total = qty * price;

      grandTotal += total;

      doc.font("Helvetica");
      doc.text(item.productName || item.name || "-", 40, y, { width: 240 });
      doc.text(qty.toString(), 300, y);
      doc.text(price.toFixed(2), 360, y);
      doc.text(total.toFixed(2), 460, y);

      y += 25;
    });

    doc.moveTo(40, y).lineTo(550, y).stroke();

    y += 20;

    doc.font("Helvetica-Bold");
    doc.text("Grand Total", 360, y);
    doc.text(`Rs. ${grandTotal.toFixed(2)}`, 460, y);

    y += 50;

    doc.fontSize(10).fillColor("#d81b60");
    doc.text(
      "Thank you for shopping with Sivakasi Muthu Crackers!",
      40,
      y,
      { align: "center" }
    );

    doc.end();
  } catch (err) {
    console.error(err);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Unable to generate invoice",
      });
    }
  }
};
