import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productCode: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    mrp: {
      type: Number,
      required: true,
    },

    offerPrice: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    stockQuantity: {
      type: Number,
      default: 100,
    },

    unit: {
      type: String,
      default: "Box",
    },

    image: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);