import fs from "fs";
import XLSX from "xlsx";
import Product from "../models/Product.js";
import generateSlug from "../utils/generateSlug.js";

export const importProductsFromExcel = async (req, res) => {
  let uploadedFilePath = "";

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an Excel file",
      });
    }

    uploadedFilePath = req.file.path;

    const workbook = XLSX.readFile(uploadedFilePath);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: null,
      raw: true,
    });

    let currentCategory = "";
    let productNumber = 1;

    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let failed = 0;

    const processedProducts = [];

    for (let index = 7; index < rows.length; index++) {
      try {
        const row = rows[index];

        if (!row || row.length === 0) {
          skipped++;
          continue;
        }

        const serialNumber = row[0];
        const productName = row[1];
        const unit = row[2];
        const mrp = Number(row[3]);
        const offerPrice = Number(row[6]);

        const isCategoryRow =
          productName &&
          (serialNumber === null || serialNumber === "") &&
          (row[2] === null || row[2] === "") &&
          (row[3] === null || row[3] === "");

        if (isCategoryRow) {
          currentCategory = String(productName).trim();
          continue;
        }

        if (
          serialNumber === null ||
          serialNumber === "" ||
          !productName ||
          !currentCategory ||
          !Number.isFinite(mrp) ||
          !Number.isFinite(offerPrice)
        ) {
          skipped++;
          continue;
        }

        const productCode = `MC${String(productNumber).padStart(4, "0")}`;

        const discount =
          mrp > 0
            ? Math.round(((mrp - offerPrice) / mrp) * 100)
            : 0;

        const productData = {
          productCode,
          name: String(productName).trim(),
          slug: generateSlug(
            `${productName}-${productCode}`
          ),
          category: currentCategory,
          mrp,
          offerPrice,
          discount,
          unit: unit ? String(unit).trim() : "Box",
          description: `${productName} - ${currentCategory}`,
          stockQuantity: 100,
          image: "",
          isActive: true,
        };

        processedProducts.push(productData);
        productNumber++;
      } catch {
        failed++;
      }
    }

    for (const productData of processedProducts) {
      try {
        const existingProduct = await Product.findOne({
          productCode: productData.productCode,
        });

        if (existingProduct) {
          existingProduct.name = productData.name;
          existingProduct.slug = productData.slug;
          existingProduct.category = productData.category;
          existingProduct.mrp = productData.mrp;
          existingProduct.offerPrice = productData.offerPrice;
          existingProduct.discount = productData.discount;
          existingProduct.unit = productData.unit;
          existingProduct.description = productData.description;
          existingProduct.isActive = true;

          await existingProduct.save();
          updated++;
        } else {
          await Product.create(productData);
          inserted++;
        }
      } catch {
        failed++;
      }
    }

    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.unlinkSync(uploadedFilePath);
    }

    res.json({
      success: true,
      message: "Excel products imported successfully",
      summary: {
        totalProcessed: processedProducts.length,
        inserted,
        updated,
        skipped,
        failed,
      },
    });
  } catch (error) {
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.unlinkSync(uploadedFilePath);
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};