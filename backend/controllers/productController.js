import Product from "../models/Product.js";
import generateSlug from "../utils/generateSlug.js";

async function createUniqueSlug(name, currentProductId = null) {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let number = 1;

  while (true) {
    const query = { slug };

    if (currentProductId) {
      query._id = { $ne: currentProductId };
    }

    const existingProduct = await Product.findOne(query);

    if (!existingProduct) {
      return slug;
    }

    slug = `${baseSlug}-${number}`;
    number += 1;
  }
}

// Public: Get products with search, category and pagination
export const getProducts = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      100
    );

    const search = String(req.query.search || "").trim();
    const category = String(req.query.category || "").trim();

    const query = {
      isActive: true,
    };

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          productCode: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (category && category.toLowerCase() !== "all") {
      query.category = category;
    }

    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Public: Get latest products
export const getLatestProducts = async (req, res) => {
  try {
    const limit = Math.min(
      Math.max(Number(req.query.limit) || 8, 1),
      20
    );

    const products = await Product.find({
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Public: Get one product by MongoDB ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }
};

// Public: Get one product by slug
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Add product
export const addProduct = async (req, res) => {
  try {
    const {
      productCode,
      name,
      category,
      mrp,
      offerPrice,
      unit,
      image,
      description,
      stockQuantity,
      isActive,
    } = req.body;

    if (
      !productCode ||
      !name ||
      !category ||
      mrp === undefined ||
      offerPrice === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product code, name, category, MRP and offer price are required",
      });
    }

    const existingCode = await Product.findOne({
      productCode: productCode.trim(),
    });

    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: "Product code already exists",
      });
    }

    const numericMrp = Number(mrp);
    const numericOfferPrice = Number(offerPrice);

    const discount =
      numericMrp > 0
        ? Math.round(
            ((numericMrp - numericOfferPrice) / numericMrp) * 100
          )
        : 0;

    const slug = await createUniqueSlug(name);

    const product = await Product.create({
      productCode: productCode.trim(),
      name: name.trim(),
      slug,
      category: category.trim(),
      mrp: numericMrp,
      offerPrice: numericOfferPrice,
      discount,
      unit: unit || "Box",
      image: image || "",
      description: description || "",
      stockQuantity: Number(stockQuantity) || 0,
      isActive: isActive ?? true,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (
      req.body.productCode &&
      req.body.productCode !== product.productCode
    ) {
      const existingCode = await Product.findOne({
        productCode: req.body.productCode.trim(),
        _id: { $ne: product._id },
      });

      if (existingCode) {
        return res.status(400).json({
          success: false,
          message: "Product code already exists",
        });
      }
    }

    if (req.body.name && req.body.name !== product.name) {
      product.slug = await createUniqueSlug(
        req.body.name,
        product._id
      );
    }

    const allowedFields = [
      "productCode",
      "name",
      "category",
      "mrp",
      "offerPrice",
      "unit",
      "image",
      "description",
      "stockQuantity",
      "isActive",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    product.mrp = Number(product.mrp);
    product.offerPrice = Number(product.offerPrice);
    product.stockQuantity = Number(product.stockQuantity);

    product.discount =
      product.mrp > 0
        ? Math.round(
            ((product.mrp - product.offerPrice) / product.mrp) * 100
          )
        : 0;

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin: Delete product permanently
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }
};