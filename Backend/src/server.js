// Backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const path = require("path");

const corsConfig = require("./config/corsConfig");
const { sequelize, connectDB } = require("./config/dbConfig");

// Load models + associations
require("./models");

// Routes
const authRoutes = require("./routes/auth.routes");
const dictRoutes = require("./routes/dictionaryRoutes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3030;

// ====== MIDDLEWARE ======
app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("common"));
app.use(helmet());
app.use(cookieParser());

// Rate limit riêng cho auth
app.use("/auth", rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }), authRoutes);

// Dictionary routes
app.use("/api/dict", dictRoutes);

// ====== DB SYNC ======
// 🔹 sync DB (force: false = không drop table)
sequelize.sync({ force: false }).then(() => {
  console.log("✅ Database synced!");
});

// ====== START SERVER ======
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Backend server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
