import Gallery from "../models/Gallery.js";

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

// Create gallery item
export const createGalleryItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      image,
      displayOrder,
      isActive,
    } = req.body;

    if (!title || !image) {
      return res.status(400).json({
        success: false,
        message: "Title and image are required",
      });
    }

    const galleryItem = await Gallery.create({
      title,
      description: description || "",
      category: category || "General",
      image,
      displayOrder: Number(displayOrder) || 0,
      isActive:
        typeof isActive === "boolean"
          ? isActive
          : true,
    });

    res.status(201).json({
      success: true,
      message: "Gallery item created successfully",
      galleryItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update gallery item
export const updateGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(
      req.params.id
    );

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "category",
      "image",
      "displayOrder",
      "isActive",
    ];

    allowedFields.forEach((field) => {
      if (
        Object.prototype.hasOwnProperty.call(
          req.body,
          field
        )
      ) {
        galleryItem[field] = req.body[field];
      }
    });

    await galleryItem.save();

    res.json({
      success: true,
      message: "Gallery item updated successfully",
      galleryItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete gallery item
export const deleteGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(
      req.params.id
    );

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};