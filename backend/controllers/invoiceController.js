import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Order from "../models/Order.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function money(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function safeText(value, fallback = "-") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return String(value);
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function drawLine(doc, y, startX = 40, endX = 555) {
  doc
    .moveTo(startX, y)
    .lineTo(endX, y)
    .strokeColor("#d1d5db")
    .lineWidth(0.7)
    .stroke();
}

function drawTableHeader(doc, y) {
  doc
    .rect(40, y, 515, 26)
    .fill("#be123c");

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(9);

  doc.text("S.No", 46, y + 8, { width: 35 });
  doc.text("Product", 84, y + 8, { width: 230 });
  doc.text("Qty", 320, y + 8, { width: 45, align: "center" });
  doc.text("Rate", 370, y + 8, { width: 75, align: "right" });
  doc.text("Amount", 455, y + 8, { width: 92, align: "right" });

  return y + 26;
}

function getOrderItems(order) {
  if (Array.isArray(order.items)) return order.items;
  if (Array.isArray(order.products)) return order.products;
  if (Array.isArray(order.orderItems)) return order.orderItems;
  return [];
}

function getCustomer(order) {
  const customer = order.customer || {};

  return {
    name:
      customer.name ||
      order.customerName ||
      order.name ||
      "Customer",
    mobile:
      customer.mobile ||
      customer.phone ||
      order.mobile ||
      order.phone ||
      "-",
    email:
      customer.email ||
      order.email ||
      "-",
    address:
      customer.address ||
      customer.fullAddress ||
      order.address ||
      order.deliveryAddress ||
      "-",
    city:
      customer.city ||
      order.city ||
      "",
    pincode:
      customer.pincode ||
      customer.postalCode ||
      order.pincode ||
      order.postalCode ||
      "",
  };
}

export async function downloadInvoice(req, res) {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const invoiceNumber =
      order.invoiceNumber ||
      `INV-${safeText(order.orderNumber || order._id)
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(-10)
        .toUpperCase()}`;

    const customer = getCustomer(order);
    const items = getOrderItems(order);

    const calculatedSubtotal = items.reduce((sum, item) => {
      const quantity = Number(item.quantity || item.qty || 1);
      const rate = Number(
        item.offerPrice ??
        item.price ??
        item.unitPrice ??
        item.product?.offerPrice ??
        item.product?.price ??
        0
      );

      return sum + quantity * rate;
    }, 0);

    const subtotal = Number(
      order.subtotal ??
      order.subTotal ??
      calculatedSubtotal
    );

    const deliveryCharge = Number(
      order.deliveryCharge ??
      order.shippingCharge ??
      order.shippingAmount ??
      0
    );

    const discount = Number(
      order.discount ??
      order.discountAmount ??
      0
    );

    const totalAmount = Number(
      order.totalAmount ??
      order.grandTotal ??
      subtotal + deliveryCharge - discount
    );

    const gstin =
      process.env.BUSINESS_GSTIN ||
      process.env.GSTIN ||
      "Update GSTIN in backend .env";

    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
      bufferPages: true,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${invoiceNumber}.pdf"`
    );

    doc.pipe(res);

    const logoCandidates = [
      path.join(__dirname, "../assets/logo.png"),
      path.join(__dirname, "../uploads/logo.png"),
      path.join(process.cwd(), "uploads/logo.png"),
    ];

    const logoPath = logoCandidates.find((candidate) =>
      fs.existsSync(candidate)
    );

    if (logoPath) {
      doc.image(logoPath, 40, 38, {
        fit: [72, 72],
        align: "left",
        valign: "center",
      });
    }

    const companyX = logoPath ? 125 : 40;

    doc
      .fillColor("#be123c")
      .font("Helvetica-Bold")
      .fontSize(21)
      .text("SIVAKASI MUTHU CRACKERS", companyX, 42);

    doc
      .fillColor("#111827")
      .font("Helvetica")
      .fontSize(9.5)
      .text(
        "Opp AJ Polytechnic College, Near Sankari Mahal,\nSattur - Sivakasi Road, Konampatti",
        companyX,
        69,
        { lineGap: 2 }
      );

    doc
      .text("Phone: +91 96003 33302  |  WhatsApp: +91 70104 00258", companyX, 99)
      .text("Email: sivakasimuthucrackers@gmail.com", companyX, 113)
      .text(`GSTIN: ${gstin}`, companyX, 127);

    doc
      .roundedRect(430, 42, 125, 46, 5)
      .fill("#fff1f2");

    doc
      .fillColor("#be123c")
      .font("Helvetica-Bold")
      .fontSize(18)
      .text("INVOICE", 430, 53, {
        width: 125,
        align: "center",
      });

    drawLine(doc, 151);

    doc
      .fillColor("#111827")
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Invoice Details", 40, 166)
      .text("Bill To", 305, 166);

    doc
      .font("Helvetica")
      .fontSize(9.5)
      .text(`Invoice No: ${invoiceNumber}`, 40, 184)
      .text(`Order No: ${safeText(order.orderNumber || order._id)}`, 40, 199)
      .text(`Invoice Date: ${formatDate(order.createdAt)}`, 40, 214)
      .text(`Payment: ${safeText(order.paymentMethod)}`, 40, 229)
      .text(`Payment Status: ${safeText(order.paymentStatus)}`, 40, 244)
      .text(`Order Status: ${safeText(order.orderStatus)}`, 40, 259);

    const fullAddress = [
      safeText(customer.address),
      customer.city,
      customer.pincode,
    ]
      .filter(Boolean)
      .join(", ");

    doc
      .font("Helvetica-Bold")
      .text(safeText(customer.name), 305, 184, {
        width: 250,
      })
      .font("Helvetica")
      .text(`Mobile: ${safeText(customer.mobile)}`, 305, 201, {
        width: 250,
      })
      .text(`Email: ${safeText(customer.email)}`, 305, 218, {
        width: 250,
      })
      .text(fullAddress || "-", 305, 235, {
        width: 250,
        height: 48,
      });

    drawLine(doc, 288);

    let y = drawTableHeader(doc, 302);

    doc
      .fillColor("#111827")
      .font("Helvetica")
      .fontSize(9);

    if (items.length === 0) {
      doc.text("No product items found for this order.", 84, y + 12);
      y += 42;
    } else {
      items.forEach((item, index) => {
        const quantity = Number(item.quantity || item.qty || 1);
        const rate = Number(
          item.offerPrice ??
          item.price ??
          item.unitPrice ??
          item.product?.offerPrice ??
          item.product?.price ??
          0
        );
        const amount = quantity * rate;
        const productName =
          item.productName ||
          item.name ||
          item.title ||
          item.product?.name ||
          item.product?.title ||
          "Product";

        const rowHeight = Math.max(
          30,
          doc.heightOfString(productName, {
            width: 230,
          }) + 14
        );

        if (y + rowHeight > 700) {
          doc.addPage();
          y = drawTableHeader(doc, 40);
        }

        if (index % 2 === 0) {
          doc
            .rect(40, y, 515, rowHeight)
            .fill("#fff7f8");
        }

        doc
          .fillColor("#111827")
          .font("Helvetica")
          .fontSize(9)
          .text(String(index + 1), 46, y + 9, {
            width: 35,
          })
          .text(productName, 84, y + 9, {
            width: 230,
          })
          .text(String(quantity), 320, y + 9, {
            width: 45,
            align: "center",
          })
          .text(money(rate), 370, y + 9, {
            width: 75,
            align: "right",
          })
          .text(money(amount), 455, y + 9, {
            width: 92,
            align: "right",
          });

        drawLine(doc, y + rowHeight, 40, 555);
        y += rowHeight;
      });
    }

    if (y > 620) {
      doc.addPage();
      y = 50;
    } else {
      y += 18;
    }

    const totalsX = 350;
    const labelWidth = 100;
    const valueWidth = 105;

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#111827")
      .text("Subtotal", totalsX, y, {
        width: labelWidth,
      })
      .text(money(subtotal), totalsX + labelWidth, y, {
        width: valueWidth,
        align: "right",
      });

    y += 20;

    doc
      .text("Delivery", totalsX, y, {
        width: labelWidth,
      })
      .text(money(deliveryCharge), totalsX + labelWidth, y, {
        width: valueWidth,
        align: "right",
      });

    y += 20;

    doc
      .text("Discount", totalsX, y, {
        width: labelWidth,
      })
      .text(`- ${money(discount)}`, totalsX + labelWidth, y, {
        width: valueWidth,
        align: "right",
      });

    y += 25;

    doc
      .roundedRect(totalsX - 5, y - 5, 210, 31, 4)
      .fill("#be123c");

    doc
      .fillColor("#ffffff")
      .font("Helvetica-Bold")
      .fontSize(11)
      .text("Grand Total", totalsX, y + 4, {
        width: labelWidth,
      })
      .text(money(totalAmount), totalsX + labelWidth, y + 4, {
        width: valueWidth,
        align: "right",
      });

    y += 58;

    doc
      .fillColor("#111827")
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Important Safety Note", 40, y);

    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor("#4b5563")
      .text(
        "Crackers must be used only under adult supervision. Follow all safety instructions printed on the product packaging. Keep water or sand nearby and maintain a safe distance while lighting fireworks.",
        40,
        y + 16,
        {
          width: 515,
          align: "justify",
          lineGap: 2,
        }
      );

    y += 68;

    drawLine(doc, y);

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#be123c")
      .text(
        "Thank you for choosing Sivakasi Muthu Crackers!",
        40,
        y + 13,
        {
          width: 515,
          align: "center",
        }
      );

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#6b7280")
      .text(
        "This is a computer-generated invoice and does not require a signature.",
        40,
        y + 31,
        {
          width: 515,
          align: "center",
        }
      );

    const pages = doc.bufferedPageRange();

    for (let pageIndex = pages.start; pageIndex < pages.start + pages.count; pageIndex += 1) {
      doc.switchToPage(pageIndex);

      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor("#9ca3af")
        .text(
          `Page ${pageIndex + 1} of ${pages.count}`,
          40,
          807,
          {
            width: 515,
            align: "right",
          }
        );
    }

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
