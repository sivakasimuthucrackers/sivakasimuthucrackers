import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      default: "",
      trim: true,
    },

    offerText: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    mobileImage: {
      type: String,
      default: "",
      trim: true,
    },

    buttonText: {
      type: String,
      default: "Shop Now",
      trim: true,
    },

    buttonLink: {
      type: String,
      default: "/products",
      trim: true,
    },

    secondaryButtonText: {
      type: String,
      default: "Price List",
      trim: true,
    },

    secondaryButtonLink: {
      type: String,
      default: "/price-list",
      trim: true,
    },

    backgroundFrom: {
      type: String,
      default: "#7f002f",
      trim: true,
    },

    backgroundVia: {
      type: String,
      default: "#d91464",
      trim: true,
    },

    backgroundTo: {
      type: String,
      default: "#ff6a00",
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 1,
      min: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Banner", bannerSchema);
