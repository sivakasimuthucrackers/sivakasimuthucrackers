import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      default: "General",
      trim: true,
    },

    // Cloudinary URL for both images and videos
    mediaUrl: {
      type: String,
      default: "",
      trim: true,
    },

    // Kept for backward compatibility with existing gallery image records
    image: {
      type: String,
      default: "",
      trim: true,
    },

    // Cloudinary public_id is needed when replacing/deleting media
    publicId: {
      type: String,
      default: "",
      trim: true,
    },

    // "image" or "video"
    resourceType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },

    displayOrder: {
      type: Number,
      default: 0,
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

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;
