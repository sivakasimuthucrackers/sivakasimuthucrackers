import cloudinary from "../config/cloudinary.js";

const PRICE_LIST_PUBLIC_ID =
  "muthu-crackers/excel/MUTHU_CRACKERS_PRICE_LIST.xlsx";

// Upload Excel buffer to Cloudinary and always replace the same file.
function uploadExcelToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        public_id: PRICE_LIST_PUBLIC_ID,
        overwrite: true,
        invalidate: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

export const importProductsFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an Excel file",
      });
    }

    const result = await uploadExcelToCloudinary(req.file.buffer);

    return res.json({
      success: true,
      message: "Excel price list replaced successfully",
      fileName: req.file.originalname,
      excelUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary Excel upload failed:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to replace Excel price list",
    });
  }
};

// Public endpoint used by the website Download Price List page.
// This always points to the fixed Cloudinary raw asset.
export const getCurrentPriceList = async (req, res) => {
  try {
    const excelUrl = cloudinary.url(PRICE_LIST_PUBLIC_ID, {
      resource_type: "raw",
      secure: true,
    });

    return res.json({
      success: true,
      fileName: "MUTHU_CRACKERS_PRICE_LIST.xlsx",
      excelUrl,
    });
  } catch (error) {
    console.error("Unable to create price list URL:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get price list",
    });
  }
};
