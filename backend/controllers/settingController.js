import Setting from "../models/Setting.js";

const defaultSettings = {
  businessName: "Sivakasi Muthu Crackers",
  phone: "96003 33302",
  whatsapp: "70104 00258",
  email: "sivakasimuthucrackers@gmail.com",
  address:
    "Opp AJ Polytechnic College, Near Sankari Mahal, Sattur - Sivakasi Road, Konampatti",
  gstin: "33CFNPM5329G3Z9",
  minimumOrderValue: 0,
  shippingCharge: 0,
  shippingMessage:
    "Shipping charges and delivery availability will be confirmed based on location and order value.",
  businessHours: "Monday to Sunday - 9:00 AM to 8:00 PM",
  upiId: "",
  bankAccountName: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  facebookUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  googleMapsUrl: "",
  logoPath: "/logo/logo.png",
  faviconPath: "/favicon.ico",
  priceListPath: "/downloads/price-list.pdf",
};

async function getOrCreateSettings() {
  let settings = await Setting.findOne();

  if (!settings) {
    settings = await Setting.create(defaultSettings);
  }

  return settings;
}

export const getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    const allowedFields = [
      "businessName",
      "phone",
      "whatsapp",
      "email",
      "address",
      "gstin",
      "minimumOrderValue",
      "shippingCharge",
      "shippingMessage",
      "businessHours",
      "upiId",
      "bankAccountName",
      "bankName",
      "accountNumber",
      "ifscCode",
      "facebookUrl",
      "instagramUrl",
      "youtubeUrl",
      "googleMapsUrl",
      "logoPath",
      "faviconPath",
      "priceListPath",
    ];

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        settings[field] = req.body[field];
      }
    });

    await settings.save();

    res.json({
      success: true,
      message: "Website settings updated successfully",
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
