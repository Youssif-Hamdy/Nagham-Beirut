require("dotenv").config();
const express    = require("express");
const mongoose   = require("mongoose");
const cors       = require("cors");
const swaggerUi  = require("swagger-ui-express");
const swaggerFile = require("./config/swagger-output.json");

const menuRoutes       = require("./routes/menuRoutes");
const employeeRoutes   = require("./routes/employeeRoutes");
const roleRoutes       = require("./routes/roleRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const errorHandler     = require("./middlewares/errorHandler");

const app      = express();
const PORT     = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// ─── Middleware ───────────────────────────────
app.use(cors({ origin: "*" }));
app.use(express.json());

// ─── Swagger UI ───────────────────────────────
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile, {
  customCssUrl: "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css",
  customJs: [
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js",
  ],
}));

// ─── Routes ───────────────────────────────────
app.use("/api/menu",        menuRoutes);
app.use("/api/employees",   employeeRoutes);
app.use("/api/roles",       roleRoutes);
app.use("/api/departments", departmentRoutes);

// ─── Root ─────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "🍽️  Nagham Menu API is running",
    docs: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      menu:        "GET  /api/menu",
      menuOffers:  "GET  /api/menu/:lang/offers",
      bestSellers: "GET  /api/menu/:lang/best-sellers",
      employees:   "GET  /api/employees",
      roles:       "GET  /api/roles",
      departments: "GET  /api/departments",
    },
  });
});

// ─── Error Handler ────────────────────────────
app.use(errorHandler);

// ─── 404 Handler ──────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Connect & Start ──────────────────────────
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📖 Swagger docs at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });