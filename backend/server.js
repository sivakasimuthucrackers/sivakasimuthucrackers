import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDatabase from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import importRoutes from "./routes/importRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";   // <-- NEW

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/import", importRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/gallery", galleryRoutes);   // <-- NEW

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Muthu Crackers Backend Running",
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
  }
}

startServer();