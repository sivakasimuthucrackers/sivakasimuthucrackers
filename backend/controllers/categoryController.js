import Category from "../models/Category.js";
import generateSlug from "../utils/generateSlug.js";
import Product from "../models/Product.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
    }).sort({ name: 1 });

    res.json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { name, image, description } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const existingCategory = await Category.findOne({
      name: name.trim(),
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name: name.trim(),
      slug: generateSlug(name),
      image: image || "",
      description: description || "",
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (req.body.name !== undefined) {
      category.name = req.body.name.trim();
      category.slug = generateSlug(req.body.name);
    }

    if (req.body.image !== undefined) {
      category.image = req.body.image;
    }

    if (req.body.description !== undefined) {
      category.description = req.body.description;
    }

    if (req.body.isActive !== undefined) {
      category.isActive = req.body.isActive;
    }

    await category.save();

    res.json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const generateCategoriesFromProducts = async (req, res) => {
  try {
    const productCategories = await Product.distinct("category", {
      category: {
        $exists: true,
        $nin: ["", null],
      },
    });

    let inserted = 0;
    let skipped = 0;

    for (const categoryName of productCategories) {
      const cleanName = String(categoryName).trim();

      if (!cleanName) {
        skipped++;
        continue;
      }

      const existingCategory = await Category.findOne({
        name: cleanName,
      });

      if (existingCategory) {
        skipped++;
        continue;
      }

      await Category.create({
        name: cleanName,
        slug: generateSlug(cleanName),
        description: `${cleanName} crackers and products`,
        image: "",
        isActive: true,
      });

      inserted++;
    }

    res.json({
      success: true,
      message: "Categories generated successfully",
      summary: {
        totalFound: productCategories.length,
        inserted,
        skipped,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};