import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";



dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ✅ Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
import uploadRoutes from "./routes/uploadRoutes.js";
app.use("/api", uploadRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("MongoDB connection is working successfully!");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
