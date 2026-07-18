import Banner from "../models/Banner.js";

const defaultBanner = {
  title: "MUTHU CRACKERS",
  subtitle: "Sivakasi Factory Direct",
  offerText: "UP TO 80% DISCOUNT",
  description:
    "Premium-quality crackers at factory-direct prices for retail, wholesale, family celebrations and festival orders.",
  image: "",
  mobileImage: "",
  buttonText: "Shop Now",
  buttonLink: "/products",
  secondaryButtonText: "Price List",
  secondaryButtonLink: "/price-list",
  backgroundFrom: "#7f002f",
  backgroundVia: "#d91464",
  backgroundTo: "#ff6a00",
  displayOrder: 1,
  isActive: true,
};

async function ensureDefaultBanner() {
  const count = await Banner.countDocuments();

  if (count === 0) {
    await Banner.create(defaultBanner);
  }
}

// Public: active banners
export const getActiveBanners = async (req, res) => {
  try {
    await ensureDefaultBanner();

    const banners = await Banner.find({
      isActive: true,
    }).sort({
      displayOrder: 1,
      createdAt: 1,
    });

    res.json({
      success: true,
      count: banners.length,
      banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: all banners
export const getBanners = async (req, res) => {
  try {
    await ensureDefaultBanner();

    const banners = await Banner.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.json({
      success: true,
      count: banners.length,
      banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createBanner = async (req, res) => {
  try {
    const banner = await Banner.create({
      title: req.body.title,
      subtitle: req.body.subtitle || "",
      offerText: req.body.offerText || "",
      description: req.body.description || "",
      image: req.body.image || "",
      mobileImage: req.body.mobileImage || "",
      buttonText: req.body.buttonText || "Shop Now",
      buttonLink: req.body.buttonLink || "/products",
      secondaryButtonText:
        req.body.secondaryButtonText || "Price List",
      secondaryButtonLink:
        req.body.secondaryButtonLink || "/price-list",
      backgroundFrom: req.body.backgroundFrom || "#7f002f",
      backgroundVia: req.body.backgroundVia || "#d91464",
      backgroundTo: req.body.backgroundTo || "#ff6a00",
      displayOrder: Number(req.body.displayOrder) || 1,
      isActive:
        typeof req.body.isActive === "boolean"
          ? req.body.isActive
          : true,
    });

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    const allowedFields = [
      "title",
      "subtitle",
      "offerText",
      "description",
      "image",
      "mobileImage",
      "buttonText",
      "buttonLink",
      "secondaryButtonText",
      "secondaryButtonLink",
      "backgroundFrom",
      "backgroundVia",
      "backgroundTo",
      "displayOrder",
      "isActive",
    ];

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        banner[field] = req.body[field];
      }
    });

    await banner.save();

    res.json({
      success: true,
      message: "Banner updated successfully",
      banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    await Banner.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
