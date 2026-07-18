import dotenv from "dotenv";
import mongoose from "mongoose";
import XLSX from "xlsx";
import path from "path";
import { fileURLToPath } from "url";
import Product from "../models/Product.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(
  __dirname,
  "../../database/MUTHU_CRACKERS _PRICE LIST.xlsx"
);

function createSlug(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function importProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: null,
    });

    let currentCategory = "";
    const products = [];
    let productNumber = 1;

    for (let index = 7; index < rows.length; index++) {
      const row = rows[index];

      const serialNumber = row[0];
      const description = row[1];
      const unit = row[2];
      const mrp = Number(row[3]);
      const offerPrice = Number(row[6]);

      // Category row, for example SPARKLERS or FLOWER POTS
      if (
        description &&
        serialNumber === null &&
        row[2] === null &&
        row[3] === null
      ) {
        currentCategory = String(description).trim();
        continue;
      }

      // Skip empty and invalid rows
      if (
        serialNumber === null ||
        !description ||
        !currentCategory ||
        !Number.isFinite(mrp) ||
        !Number.isFinite(offerPrice)
      ) {
        continue;
      }

      const discount =
        mrp > 0 ? Math.round(((mrp - offerPrice) / mrp) * 100) : 0;

      products.push({
        productCode: `MC${String(productNumber).padStart(4, "0")}`,
        name: String(description).trim(),
        category: currentCategory,
        mrp,
        offerPrice,
        discount,
        unit: unit ? String(unit).trim() : "Box",
        image: "",
        description: `${description} from ${currentCategory}`,
        stockQuantity: 100,
        isActive: true,
        slug: createSlug(description),
      });

      productNumber++;
    }

    await Product.deleteMany({});
    console.log("Old products removed");

    await Product.insertMany(products);

    console.log(`${products.length} products imported successfully`);
    process.exit(0);
  } catch (error) {
    console.error("Import failed:", error.message);
    process.exit(1);
  }
}

importProducts();