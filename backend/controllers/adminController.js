import Admin from "../models/Admin.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import generateToken from "../utils/generateToken.js";

// Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({
      email: String(email || "").toLowerCase().trim(),
    });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.json({
      success: true,
      token: generateToken(admin._id),
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Dashboard Summary
export const dashboard = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const [
      totalProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      todayOrders,
      revenueResult,
      customerResult,
    ] = await Promise.all([
      Product.countDocuments(),

      Order.countDocuments(),

      Order.countDocuments({
        orderStatus: "Pending",
      }),

      Order.countDocuments({
        orderStatus: "Delivered",
      }),

      Order.countDocuments({
        createdAt: {
          $gte: todayStart,
          $lt: tomorrowStart,
        },
      }),

      Order.aggregate([
        {
          $match: {
            orderStatus: {
              $ne: "Cancelled",
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$totalAmount",
            },
          },
        },
      ]),

      Order.aggregate([
        {
          $match: {
            "customer.mobile": {
              $exists: true,
              $nin: ["", null],
            },
          },
        },
        {
          $group: {
            _id: "$customer.mobile",
          },
        },
        {
          $count: "totalCustomers",
        },
      ]),
    ]);

    res.json({
      success: true,
      dashboard: {
        totalProducts,
        totalOrders,
        pendingOrders,
        completedOrders,
        todayOrders,
        totalCustomers: customerResult[0]?.totalCustomers || 0,
        revenue: revenueResult[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Recent Orders
export const recentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({
        createdAt: -1,
      })
      .limit(10)
      .select(
        "orderNumber customer totalAmount orderStatus paymentStatus createdAt"
      );

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Low Stock Products
export const lowStockProducts = async (req, res) => {
  try {
    const threshold = Math.max(
      Number(req.query.threshold) || 10,
      0
    );

    const products = await Product.find({
      isActive: true,
      stockQuantity: {
        $lte: threshold,
      },
    })
      .sort({
        stockQuantity: 1,
      })
      .limit(10)
      .select(
        "productCode name category stockQuantity image"
      );

    res.json({
      success: true,
      threshold,
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

// Best-Selling Products
export const bestSellingProducts = async (req, res) => {
  try {
    const products = await Order.aggregate([
      {
        $match: {
          orderStatus: {
            $ne: "Cancelled",
          },
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: {
            productId: "$items.productId",
            name: "$items.name",
          },
          totalQuantity: {
            $sum: "$items.quantity",
          },
          totalRevenue: {
            $sum: "$items.subtotal",
          },
          orderCount: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          totalQuantity: -1,
        },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: 0,
          productId: "$_id.productId",
          name: "$_id.name",
          totalQuantity: 1,
          totalRevenue: 1,
          orderCount: 1,
        },
      },
    ]);

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

// Order Status Summary
export const orderSummary = async (req, res) => {
  try {
    const summaryResult = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const summary = {
      Pending: 0,
      Confirmed: 0,
      Packed: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    summaryResult.forEach((item) => {
      if (item._id) {
        summary[item._id] = item.count;
      }
    });

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Sales Report
export const salesReport = async (req, res) => {
  try {
    const days = Math.min(
      Math.max(Number(req.query.days) || 7, 1),
      365
    );

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - (days - 1));

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
          },
          orderStatus: {
            $ne: "Cancelled",
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          revenue: {
            $sum: "$totalAmount",
          },
          orders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const resultMap = new Map(
      result.map((item) => [item._id, item])
    );

    const report = [];

    for (let index = 0; index < days; index += 1) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + index);

      const dateKey = currentDate.toISOString().slice(0, 10);
      const existing = resultMap.get(dateKey);

      report.push({
        date: dateKey,
        revenue: existing?.revenue || 0,
        orders: existing?.orders || 0,
      });
    }

    res.json({
      success: true,
      days,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};