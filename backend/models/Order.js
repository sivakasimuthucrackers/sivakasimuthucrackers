import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      default: "",
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    offerPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      trim: true,
      index: true,
    },

    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      mobile: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        default: "",
        trim: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      district: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      pincode: {
        type: String,
        required: true,
        trim: true,
      },

      gstNumber: {
        type: String,
        default: "",
        trim: true,
      },
    },

    items: {
      type: [itemSchema],
      required: true,
      validate: {
        validator(items) {
          return Array.isArray(items) && items.length > 0;
        },
        message: "At least one order item is required",
      },
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: [
        "UPI",
        "Bank Transfer",
        "Cash on Delivery",
        "WhatsApp Confirmation",
      ],
      default: "WhatsApp Confirmation",
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Failed",
        "Refunded",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
