const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { connectDB, ObjectId } = require("./config/db");
const { seedIfEmpty } = require("./seed");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

async function main() {
  const collections = await connectDB();

  app.use("/api", require("./routes/products")(collections, ObjectId));
  app.use("/api", require("./routes/cart")(collections, ObjectId));
  app.use("/api", require("./routes/orders")(collections, ObjectId));
  app.use("/api", require("./routes/reviews")(collections));
  app.use("/api", require("./routes/categories")(collections));
  app.use("/api", require("./routes/coupons")(collections));
  app.use("/api", require("./routes/inventory")(collections, ObjectId));
  app.use("/api", require("./routes/notifications")(collections, ObjectId));
  app.use("/api", require("./routes/wishlist")(collections, ObjectId));
  app.use("/api", require("./routes/announcements")(collections));
  app.use("/api", require("./routes/apiKeys")(collections, ObjectId));
  app.use("/api", require("./routes/auditLogs")(collections));
  app.use("/api", require("./routes/emailTemplates")(collections, ObjectId));
  app.use("/api", require("./routes/addresses")(collections, ObjectId));
  app.use("/api", require("./routes/users")(collections, ObjectId));
  app.use("/api", require("./routes/shipping")());
  app.use("/api", require("./routes/reports")(collections));

  await seedIfEmpty(collections);

  console.log("Pinged your deployment. You successfully connected to MongoDB!");
}

main().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Wellcome to the Shop-Co Server!");
});

app.listen(port, () => {
  console.log(`Shop-Co listening on port ${port}`);
});

module.exports = app;
