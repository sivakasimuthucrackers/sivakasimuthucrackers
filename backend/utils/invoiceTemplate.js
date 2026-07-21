import fs from "fs";
import path from "path";

const PAGE = {
  left: 22,
  right: 573,
  top: 18,
  bottom: 820,
  width: 551,
};

function text(value, fallback = "-") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

function number(value) {
  return Number(value || 0);
}

function money(value) {
  return number(value).toFixed(2);
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function drawCell(doc, x, y, width, height, options = {}) {
  doc
    .rect(x, y, width, height)
    .lineWidth(options.lineWidth || 0.7)
    .strokeColor(options.strokeColor || "#222222")
    .stroke();

  if (options.fillColor) {
    doc
      .rect(x, y, width, height)
      .fillColor(options.fillColor)
      .fillOpacity(options.fillOpacity ?? 1)
      .fill();

    doc.fillOpacity(1);
  }
}

function drawText(doc, value, x, y, width, options = {}) {
  doc
    .fillColor(options.color || "#111111")
    .font(options.bold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(options.fontSize || 9)
    .text(text(value, ""), x, y, {
      width,
      align: options.align || "left",
      lineGap: options.lineGap || 0,
      ellipsis: options.ellipsis || false,
    });
}

const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

function belowHundred(n) {
  if (n < 20) return ones[n];
  return `${tens[Math.floor(n / 10)]}${n % 10 ? ` ${ones[n % 10]}` : ""}`;
}

function belowThousand(n) {
  if (n < 100) return belowHundred(n);

  return `${ones[Math.floor(n / 100)]} Hundred${
    n % 100 ? ` ${belowHundred(n % 100)}` : ""
  }`;
}

export function amountInWords(value) {
  let n = Math.round(number(value));

  if (n === 0) return "Zero Only";

  const parts = [];

  const crore = Math.floor(n / 10000000);
  n %= 10000000;

  const lakh = Math.floor(n / 100000);
  n %= 100000;

  const thousand = Math.floor(n / 1000);
  n %= 1000;

  if (crore) parts.push(`${belowThousand(crore)} Crore`);
  if (lakh) parts.push(`${belowHundred(lakh)} Lakh`);
  if (thousand) parts.push(`${belowHundred(thousand)} Thousand`);
  if (n) parts.push(belowThousand(n));

  return `${parts.join(" ")} Only`;
}


function buildAddress(...values) {
  const parts = [];
  const ignoredKeys = new Set([
    "_id",
    "id",
    "__v",
    "name",
    "email",
    "mobile",
    "phone",
    "gstNumber",
    "createdAt",
    "updatedAt",
  ]);

  function addPart(value) {
    if (value === null || value === undefined || value === "") return;

    if (typeof value === "string" || typeof value === "number") {
      const cleaned = String(value).trim();

      if (cleaned && cleaned !== "-" && !parts.includes(cleaned)) {
        parts.push(cleaned);
      }

      return;
    }

    if (Array.isArray(value)) {
      value.forEach(addPart);
      return;
    }

    if (typeof value === "object") {
      const preferredKeys = [
        "fullAddress",
        "deliveryAddress",
        "shippingAddress",
        "address",
        "addressLine1",
        "addressLine2",
        "houseNumber",
        "doorNumber",
        "street",
        "road",
        "area",
        "locality",
        "landmark",
        "post",
        "city",
        "district",
        "state",
        "pincode",
        "pinCode",
        "postalCode",
        "country",
      ];

      preferredKeys.forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          addPart(value[key]);
        }
      });

      Object.entries(value).forEach(([key, nestedValue]) => {
        if (!preferredKeys.includes(key) && !ignoredKeys.has(key)) {
          addPart(nestedValue);
        }
      });
    }
  }

  values.forEach(addPart);

  return parts.join(", ");
}


function findEmail(value, visited = new Set()) {
  if (value === null || value === undefined) return "";

  if (typeof value === "string") {
    const match = value.match(
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
    );

    return match ? match[0] : "";
  }

  if (typeof value !== "object") return "";

  if (visited.has(value)) return "";
  visited.add(value);

  const preferredEmailKeys = [
    "email",
    "customerEmail",
    "emailAddress",
    "mail",
    "gmail",
  ];

  for (const key of preferredEmailKeys) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      const found = findEmail(value[key], visited);

      if (found) return found;
    }
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    if (key.toLowerCase().includes("email")) {
      const found = findEmail(nestedValue, visited);

      if (found) return found;
    }
  }

  for (const nestedValue of Object.values(value)) {
    const found = findEmail(nestedValue, visited);

    if (found) return found;
  }

  return "";
}

export function getInvoiceData(order) {
  const customer = order.customer || {};
  const items =
    order.items ||
    order.products ||
    order.orderItems ||
    [];

  const normalizedItems = items.map((item, index) => {
    const quantity = number(item.quantity || item.qty || 1);
    const rate = number(
      item.originalPrice ??
      item.mrp ??
      item.price ??
      item.unitPrice ??
      item.offerPrice ??
      item.product?.originalPrice ??
      item.product?.price ??
      item.product?.offerPrice ??
      0
    );

    return {
      sno: index + 1,
      code:
        item.code ||
        item.productCode ||
        item.sku ||
        item.product?.code ||
        item.product?.productCode ||
        "",
      name:
        item.productName ||
        item.name ||
        item.title ||
        item.product?.name ||
        item.product?.title ||
        "Product",
      quantity,
      rate,
      total: quantity * rate,
    };
  });

  const grossAmount = normalizedItems.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const discountPercent = number(
    order.discountPercent ??
    order.discountPercentage ??
    order.discount ??
    0
  );

  const discountAmount =
    order.discountAmount !== undefined
      ? number(order.discountAmount)
      : grossAmount * (discountPercent / 100);

  const grandTotal = number(
    order.totalAmount ??
    order.grandTotal ??
    grossAmount - discountAmount
  );

  return {
    estimateNumber:
      order.estimateNumber ||
      order.invoiceNumber ||
      order.orderNumber ||
      text(order._id),
    date: formatDate(order.createdAt || new Date()),
    customer: {
      name:
        customer.name ||
        order.customerName ||
        order.name ||
        "Customer",
      place:
        customer.city ||
        customer.place ||
        order.city ||
        order.place ||
        "",
      contact:
        customer.mobile ||
        customer.phone ||
        order.mobile ||
        order.phone ||
        "",

      email:
        customer.email ||
        order.customer?.email ||
        order.email ||
        "",

      address: [
        customer.address,
        customer.city,
        customer.district,
        customer.state,
        customer.pincode,
      ]
        .filter(Boolean)
        .join(", "),
    },
    items: normalizedItems,
    totalQuantity: normalizedItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    ),
    grossAmount,
    discountPercent,
    discountAmount,
    grandTotal,
    amountWords: amountInWords(grandTotal),
  };
}

function drawHeader(doc, data, logoPath) {
  const headerY = 18;
  const headerH = 142;

  drawCell(doc, PAGE.left, headerY, PAGE.width, headerH);

  if (logoPath && fs.existsSync(logoPath)) {
    doc.image(logoPath, 36, 33, {
      fit: [150, 92],
      align: "center",
      valign: "center",
    });
  } else {
    drawText(doc, "SIVAKASI", 38, 44, 145, {
      bold: true,
      fontSize: 14,
      align: "center",
      color: "#c2185b",
    });

    drawText(doc, "MUTHU", 38, 67, 145, {
      bold: true,
      fontSize: 27,
      align: "center",
      color: "#c2185b",
    });

    drawText(doc, "CRACKERS", 38, 103, 145, {
      bold: true,
      fontSize: 11,
      align: "center",
      color: "#d97706",
    });
  }

  drawText(
    doc,
    "No 3/270 H6, Near Sankari Mahal,\nOpp A.J. Polytechnic College, Sattur Road, Sivakasi.",
    205,
    36,
    260,
    {
      fontSize: 10,
      lineGap: 6,
    }
  );

  drawText(
    doc,
    "sivakasimuthucrackers@gmail.com",
    205,
    92,
    260,
    {
      fontSize: 10,
    }
  );

  drawText(
    doc,
    "sivakasimuthucrackers.com",
    205,
    116,
    260,
    {
      fontSize: 10,
    }
  );

  drawText(
    doc,
    "96003 33302\n70104 00258",
    465,
    32,
    95,
    {
      bold: true,
      fontSize: 11,
      align: "right",
      lineGap: 4,
    }
  );

  const customerY = 160;
  const customerH = 145;
  const estimateX = 430;

  drawCell(doc, PAGE.left, customerY, estimateX - PAGE.left, customerH);
  drawCell(doc, estimateX, customerY, PAGE.right - estimateX, customerH);

  drawText(doc, `To. ${data.customer.name}`, 34, 171, 380, {
    bold: true,
    fontSize: 10,
  });

  drawText(doc, data.customer.place, 38, 199, 370, {
    bold: true,
    fontSize: 11,
  });

  drawText(
    doc,
    `Contact : ${data.customer.contact || ""}`,
    38,
    211,
    370,
    {
      bold: true,
      fontSize: 9.5,
    }
  );

  drawText(
    doc,
    `Email : ${data.customer.email || "-"}`,
    38,
    229,
    370,
    {
      fontSize: 9,
    }
  );

  drawText(
    doc,
    `Delivery Address : ${data.customer.address || "-"}`,
    38,
    247,
    380,
    {
      fontSize: 8.5,
      lineGap: 2,
    }
  );

  drawText(
    doc,
    `Estimate No : ${data.estimateNumber}`,
    438,
    171,
    126,
    {
      bold: true,
      fontSize: 10,
    }
  );

  drawText(doc, `Date : ${data.date}`, 438, 193, 126, {
    bold: true,
    fontSize: 10,
  });

  return 305;
}

function drawTableHeader(doc, y) {
  const columns = [
    { x: 22, w: 35, label: "SNo" },
    { x: 57, w: 40, label: "Code" },
    { x: 97, w: 300, label: "Cracker name" },
    { x: 397, w: 62, label: "Quantity" },
    { x: 459, w: 55, label: "Rate" },
    { x: 514, w: 59, label: "Total" },
  ];

  const h = 31;

  columns.forEach((column) => {
    drawCell(doc, column.x, y, column.w, h);

    drawText(doc, column.label, column.x + 2, y + 10, column.w - 4, {
      bold: true,
      fontSize: 9,
      align: "center",
    });
  });

  return y + h;
}

function drawWatermark(doc, watermarkPath, y, height) {
  if (!watermarkPath || !fs.existsSync(watermarkPath)) return;

  doc.save();
  doc.opacity(0.11);

  doc.image(watermarkPath, 170, y + Math.max(20, height / 2 - 90), {
    fit: [250, 180],
    align: "center",
    valign: "center",
  });

  doc.restore();
}

function drawItems(doc, data, startY, watermarkPath) {
  const rowH = 21;
  const usableBottom = 690;
  let y = startY;
  let pageItemStart = 0;

  data.items.forEach((item, index) => {
    if (y + rowH > usableBottom) {
      drawWatermark(
        doc,
        watermarkPath,
        startY,
        y - startY
      );

      doc.addPage();
      y = drawTableHeader(doc, 22);
      pageItemStart = index;
    }

    const values = [
      { x: 22, w: 35, value: item.sno, align: "center" },
      { x: 57, w: 40, value: item.code, align: "center" },
      { x: 97, w: 300, value: item.name, align: "left" },
      { x: 397, w: 62, value: item.quantity, align: "center" },
      { x: 459, w: 55, value: money(item.rate), align: "right" },
      { x: 514, w: 59, value: money(item.total), align: "right" },
    ];

    values.forEach((cell) => {
      drawCell(doc, cell.x, y, cell.w, rowH);

      drawText(
        doc,
        cell.value,
        cell.x + 4,
        y + 6,
        cell.w - 8,
        {
          fontSize: 8.6,
          align: cell.align,
          ellipsis: true,
        }
      );
    });

    y += rowH;
  });

  drawWatermark(
    doc,
    watermarkPath,
    startY,
    y - startY
  );

  const minTableBottom = 690;

  if (y < minTableBottom) {
    const remainingH = minTableBottom - y;

    [
      { x: 22, w: 35 },
      { x: 57, w: 40 },
      { x: 97, w: 300 },
      { x: 397, w: 62 },
      { x: 459, w: 55 },
      { x: 514, w: 59 },
    ].forEach((column) => {
      drawCell(doc, column.x, y, column.w, remainingH);
    });

    y = minTableBottom;
  }

  drawText(doc, data.totalQuantity, 399, y - 20, 56, {
    bold: true,
    fontSize: 9,
    align: "center",
  });

  drawText(doc, money(data.grossAmount), 516, y - 20, 53, {
    bold: true,
    fontSize: 9,
    align: "right",
  });

  return y;
}

function drawSummary(doc, data, y) {
  const summaryH = 100;
  const splitX = 420;
  const labelX = 420;
  const amountX = 500;

  drawCell(doc, 22, y, splitX - 22, summaryH);
  drawCell(doc, splitX, y, 93, summaryH);
  drawCell(doc, 513, y, 60, summaryH);

  drawText(doc, "Amount in words :", 28, y + 50, 380, {
    fontSize: 9.5,
  });

  drawText(doc, data.amountWords, 28, y + 67, 380, {
    fontSize: 9.5,
    bold: true,
  });

  drawText(doc, "Discount Items", labelX + 4, y + 8, 85, {
    fontSize: 9,
  });

  drawText(doc, `Discount ${data.discountPercent}%`, labelX + 4, y + 28, 85, {
    fontSize: 9,
  });

  drawText(doc, "Total", labelX + 4, y + 48, 85, {
    fontSize: 9,
    bold: true,
  });

  drawText(doc, money(data.grossAmount), amountX + 16, y + 8, 52, {
    fontSize: 9,
    align: "right",
  });

  drawText(doc, money(data.discountAmount), amountX + 16, y + 28, 52, {
    fontSize: 9,
    align: "right",
  });

  drawText(doc, money(data.grandTotal), amountX + 16, y + 48, 52, {
    fontSize: 9,
    align: "right",
    bold: true,
  });

  const footerY = y + summaryH + 5;

  drawText(doc, "E & O.E", 22, footerY, 100, {
    bold: true,
    fontSize: 9,
  });

  drawText(doc, "Thank you for business with us!", 210, footerY, 230, {
    bold: true,
    fontSize: 9,
    align: "center",
  });
}

export function renderEstimateInvoice(doc, order, options = {}) {
  const data = getInvoiceData(order);

  const logoPath = options.logoPath || null;
  const watermarkPath =
    options.watermarkPath ||
    logoPath ||
    null;

  let y = drawHeader(doc, data, logoPath);
  y = drawTableHeader(doc, y);
  y = drawItems(doc, data, y, watermarkPath);
  drawSummary(doc, data, y);

  return data;
}
