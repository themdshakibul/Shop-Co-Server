const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { connectDB, getCollections, ObjectId } = require("./config/db");
const { seedIfEmpty } = require("./seed");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// Middleware: attach collections to req lazily
app.use(async (req, res, next) => {
  try {
    const collections = getCollections();
    req.collections = collections;
    req.ObjectId = ObjectId;
    next();
  } catch {
    try {
      const collections = await connectDB();
      req.collections = collections;
      req.ObjectId = ObjectId;
      seedIfEmpty(collections).catch(() => {});
      next();
    } catch (e) {
      console.error("DB connection error:", e.message, e.stack);
      res.status(500).json({ error: "Failed to connect to database", detail: e.message });
    }
  }
});

app.use("/api", require("./routes/products")());
app.use("/api", require("./routes/cart")());
app.use("/api", require("./routes/orders")());
app.use("/api", require("./routes/reviews")());
app.use("/api", require("./routes/categories")());
app.use("/api", require("./routes/coupons")());
app.use("/api", require("./routes/inventory")());
app.use("/api", require("./routes/notifications")());
app.use("/api", require("./routes/wishlist")());
app.use("/api", require("./routes/announcements")());
app.use("/api", require("./routes/apiKeys")());
app.use("/api", require("./routes/auditLogs")());
app.use("/api", require("./routes/emailTemplates")());
app.use("/api", require("./routes/addresses")());
app.use("/api", require("./routes/users")());
app.use("/api", require("./routes/shipping")());
app.use("/api", require("./routes/reports")());

app.get("/", (req, res) => {
  res.send("Wellcome to the Shop-Co Server!");
});

if (require.main === module) {
  connectDB().then(() => {
    app.listen(port, () => {
      console.log(`Shop-Co listening on port ${port}`);
    });
  }).catch(console.dir);
}

module.exports = app;
