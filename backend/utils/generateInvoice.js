import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";
import { renderEstimateInvoice } from "./invoiceTemplate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function generateInvoice(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 0,
        bufferPages: true,
      });

      const chunks = [];

      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });

      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", (err) => {
        reject(err);
      });

      // Logo path
      const logoPath = path.join(
        __dirname,
        "../uploads/logo.png"
      );

      renderEstimateInvoice(doc, order, {
        logoPath,
        watermarkPath: logoPath,
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}