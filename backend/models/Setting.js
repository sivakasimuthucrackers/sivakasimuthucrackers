import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      default: "Sivakasi Muthu Crackers",
      trim: true,
    },

    phone: {
      type: String,
      default: "96003 33302",
      trim: true,
    },

    whatsapp: {
      type: String,
      default: "70104 00258",
      trim: true,
    },

    email: {
      type: String,
      default: "sivakasimuthucrackers@gmail.com",
      trim: true,
    },

    address: {
      type: String,
      default:
        "Opp AJ Polytechnic College, Near Sankari Mahal, Sattur - Sivakasi Road, Konampatti",
      trim: true,
    },

    gstin: {
      type: String,
      default: "33CFNPM5329G3Z9",
      trim: true,
    },

    minimumOrderValue: {
      type: Number,
      default: 0,
      min: 0,
    },

    shippingCharge: {
      type: Number,
      default: 0,
      min: 0,
    },

    shippingMessage: {
      type: String,
      default:
        "Shipping charges and delivery availability will be confirmed based on location and order value.",
      trim: true,
    },

    businessHours: {
      type: String,
      default: "Monday to Sunday - 9:00 AM to 8:00 PM",
      trim: true,
    },

    upiId: {
      type: String,
      default: "",
      trim: true,
    },

    bankAccountName: {
      type: String,
      default: "",
      trim: true,
    },

    bankName: {
      type: String,
      default: "",
      trim: true,
    },

    accountNumber: {
      type: String,
      default: "",
      trim: true,
    },

    ifscCode: {
      type: String,
      default: "",
      trim: true,
    },

    facebookUrl: {
      type: String,
      default: "",
      trim: true,
    },

    instagramUrl: {
      type: String,
      default: "",
      trim: true,
    },

    youtubeUrl: {
      type: String,
      default: "",
      trim: true,
    },

    googleMapsUrl: {
      type: String,
      default: "",
      trim: true,
    },

    logoPath: {
      type: String,
      default: "/logo/logo.png",
      trim: true,
    },

    faviconPath: {
      type: String,
      default: "/favicon.ico",
      trim: true,
    },

    priceListPath: {
      type: String,
      default: "/downloads/price-list.pdf",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Setting", settingSchema);
