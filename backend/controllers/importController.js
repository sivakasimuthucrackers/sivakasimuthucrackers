import cloudinary from "../config/cloudinary.js";

// Upload Excel buffer to Cloudinary and always replace the same file.
function uploadExcelToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        public_id: "muthu-crackers/excel/MUTHU_CRACKERS_PRICE_LIST.xlsx",
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
