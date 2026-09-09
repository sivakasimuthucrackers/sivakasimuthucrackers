import Gallery from "../models/Gallery.js";
import cloudinary from "../config/cloudinary.js";

const uploadBufferToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "muthu-crackers/gallery",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });
};

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType === "video" ? "video" : "image",
      invalidate: true,
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
  }
};

// Get active gallery items for customer website
export const getActiveGalleryItems = async (req, res) => {
  try {
    const galleryItems = await Gallery.find({
      isActive: true,
    }).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.json({
      success: true,
      count: galleryItems.length,
      galleryItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all gallery items for admin
export const getGalleryItems = async (req, res) => {
  try {
    const galleryItems = await Gallery.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.json({
      success: true,
      count: galleryItems.length,
      galleryItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create gallery item with image/video upload
export const createGalleryItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      displayOrder,
      isActive,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image or video",
      });
    }

    const uploaded = await uploadBufferToCloudinary(req.file.buffer);

    const resourceType =
      uploaded.resource_type === "video" ? "video" : "image";

    const activeValue =
      typeof isActive === "boolean"
        ? isActive
        : String(isActive).toLowerCase() !== "false";

    const galleryItem = await Gallery.create({
      title,
      description: description || "",
      category: category || "General",
      mediaUrl: uploaded.secure_url,
      // Also populate image so older frontend code will still display new images/videos.
      image: uploaded.secure_url,
      publicId: uploaded.public_id,
      resourceType,
      displayOrder: Number(displayOrder) || 0,
      isActive: activeValue,
    });

    res.status(201).json({
      success: true,
      message:
        resourceType === "video"
          ? "Gallery video uploaded successfully"
          : "Gallery image uploaded successfully",
      galleryItem,
    });
  } catch (error) {
    console.error("Create gallery error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Gallery upload failed",
    });
  }
};

// Update gallery item.
// Media file is optional. If a new file is selected, the old Cloudinary file is removed.
export const updateGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "title")) {
      galleryItem.title = req.body.title;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "description")) {
      galleryItem.description = req.body.description || "";
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "category")) {
      galleryItem.category = req.body.category || "General";
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "displayOrder")) {
      galleryItem.displayOrder = Number(req.body.displayOrder) || 0;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "isActive")) {
      galleryItem.isActive =
        String(req.body.isActive).toLowerCase() !== "false";
    }

    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer);

      // Delete old Cloudinary file only after the new upload succeeds
      await deleteFromCloudinary(
        galleryItem.publicId,
        galleryItem.resourceType
      );

      galleryItem.mediaUrl = uploaded.secure_url;
      galleryItem.image = uploaded.secure_url;
      galleryItem.publicId = uploaded.public_id;
      galleryItem.resourceType =
        uploaded.resource_type === "video" ? "video" : "image";
    }

    await galleryItem.save();

    res.json({
      success: true,
      message: "Gallery item updated successfully",
      galleryItem,
    });
  } catch (error) {
    console.error("Update gallery error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Gallery update failed",
    });
  }
};

// Delete gallery item + Cloudinary media
export const deleteGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    await deleteFromCloudinary(
      galleryItem.publicId,
      galleryItem.resourceType
    );

    await Gallery.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    console.error("Delete gallery error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
