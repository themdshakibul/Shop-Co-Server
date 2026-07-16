const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { ServerApiVersion, MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT;
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = client.db("Shop-co");
    const allProductsCollection = db.collection("Products");
    const addToCardCollection = db.collection("AddToCard");
    const ordersCollection = db.collection("Orders");
    const reviewsCollection = db.collection("Reviews");
    const categoriesCollection = db.collection("Categories");
    const couponsCollection = db.collection("Coupons");
    const inventoryCollection = db.collection("Inventory");
    const notificationsCollection = db.collection("Notifications");
    const wishlistCollection = db.collection("Wishlist");
    const announcementsCollection = db.collection("Announcements");
    const apiKeysCollection = db.collection("ApiKeys");
    const auditLogsCollection = db.collection("AuditLogs");
    const emailTemplatesCollection = db.collection("EmailTemplates");

    // All Products API
    app.get("/api/all-products", async (req, res) => {
      const result = await allProductsCollection.find().toArray();
      res.json(result);
    });

    app.get("/api/all-products/:id", async (req, res) => {
      const id = req.params.id;
      const result = await allProductsCollection.findOne({
        _id: new ObjectId(id),
      });
      res.json(result);
    });

    app.get("/api/all-reviews", async (req, res) => {
      const result = await allProductsCollection.find().toArray();
      res.json(result);
    });

    // Add To Card API

    app.get("/api/add-to-card", async (req, res) => {
      try {
        const { email } = req.query;

        let result;
        if (email) {
          result = await addToCardCollection.find({ userEmail: email }).toArray();
        } else {
          result = await addToCardCollection.find().toArray();
        }

        res.status(200).json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({
          success: false,
          message: "Failed to fetch cart items!",
        });
      }
    });

    app.post("/api/add-to-card", async (req, res) => {
      try {
        const cartItem = req.body;

        const { productId, userEmail, size, color } = cartItem;

        const isExist = await addToCardCollection.findOne({
          userEmail: userEmail,
          productId: productId,
          size: size,
          color: color,
        });

        if (isExist) {
          return res.status(400).json({
            success: false,
            message: "This specific variant is already added to your cart!",
          });
        }

        const result = await addToCardCollection.insertOne(cartItem);
        res.status(201).json({ success: true, result });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          success: false,
          message: "Failed to add product to cart!",
        });
      }
    });

    // Quantity আপডেট করার জন্য
    app.patch("/api/add-to-card/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({
            success: false,
            message: "Invalid item id!",
          });
        }

        const result = await addToCardCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { quantity } },
        );

        res.status(200).json({ success: true, result });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          success: false,
          message: "Failed to update quantity!",
        });
      }
    });

    app.delete("/api/add-to-card/:id", async (req, res) => {
      try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({
            success: false,
            message: "Invalid item id!",
          });
        }

        const result = await addToCardCollection.deleteOne({
          _id: new ObjectId(id),
        });

        res.status(200).json({ success: true, result });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          success: false,
          message: "Failed to remove item!",
        });
      }
    });

    // === Dashboard / Admin APIs ===

    app.get("/api/users", async (req, res) => {
      try {
        const usersCollection = db.collection("user");
        const users = await usersCollection
          .find({}, { projection: { password: 0 } })
          .toArray();
        res.json(users);
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch users" });
      }
    });

    app.patch("/api/users/:id/role", async (req, res) => {
      try {
        const { id } = req.params;
        const { role } = req.body;
        const usersCollection = db.collection("user");
        const result = await usersCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { role } },
        );
        res.json({ success: true, result });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update role" });
      }
    });

    app.post("/api/all-products", async (req, res) => {
      try {
        const product = req.body;
        const result = await allProductsCollection.insertOne(product);
        res.status(201).json({ success: true, result });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to add product" });
      }
    });

    app.patch("/api/all-products/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const updates = req.body;
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ success: false, message: "Invalid id" });
        }
        const result = await allProductsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updates },
        );
        res.json({ success: true, result });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update product" });
      }
    });

    app.delete("/api/all-products/:id", async (req, res) => {
      try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ success: false, message: "Invalid id" });
        }
        const result = await allProductsCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.json({ success: true, result });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to delete product" });
      }
    });

    // Addresses API
    const addressesCollection = db.collection("Addresses");

    app.get("/api/addresses", async (req, res) => {
      try {
        const { email } = req.query;
        let result;
        if (email) {
          result = await addressesCollection.find({ userEmail: email }).toArray();
        } else {
          result = await addressesCollection.find().toArray();
        }
        res.status(200).json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch addresses" });
      }
    });

    app.post("/api/addresses", async (req, res) => {
      try {
        const address = req.body;
        if (address.default) {
          await addressesCollection.updateMany(
            { userEmail: address.userEmail },
            { $set: { default: false } },
          );
        }
        const result = await addressesCollection.insertOne(address);
        res.status(201).json({ success: true, result });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to add address" });
      }
    });

    app.patch("/api/addresses/:id", async (req, res) => {
      try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ success: false, message: "Invalid id" });
        }
        const updates = req.body;
        if (updates.default) {
          const existing = await addressesCollection.findOne({ _id: new ObjectId(id) });
          await addressesCollection.updateMany(
            { userEmail: existing.userEmail },
            { $set: { default: false } },
          );
        }
        const result = await addressesCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updates },
        );
        res.json({ success: true, result });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to update address" });
      }
    });

    app.delete("/api/addresses/:id", async (req, res) => {
      try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ success: false, message: "Invalid id" });
        }
        const result = await addressesCollection.deleteOne({ _id: new ObjectId(id) });
        res.json({ success: true, result });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to delete address" });
      }
    });

    // ─── Shipping Settings API ──────────────────────────────────
    app.get("/api/shipping-settings", async (req, res) => {
      try {
        res.json({
          freeShippingMin: 100,
          standard: { label: "Standard", days: "5-7 business days", cost: 0 },
          express: { label: "Express", days: "2-3 business days", cost: 12.99 },
          returns: "30-day return policy. Items must be unworn with tags attached.",
        });
      } catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    // ─── Seed Data ──────────────────────────────────────────────
    async function seedIfEmpty(collection, data) {
      const count = await collection.countDocuments();
      if (count === 0 && data.length > 0) await collection.insertMany(data);
    }

    await seedIfEmpty(ordersCollection, [
      { orderId: "ORD-001", customer: "Rahim Uddin", product: "T-shirt with Tape Details", amount: 145, status: "Processing", date: "2026-07-15", email: "rahim@example.com" },
      { orderId: "ORD-002", customer: "Fatima Khatun", product: "Skinny Fit Jeans", amount: 240, status: "Shipped", date: "2026-07-14", email: "fatima@example.com" },
      { orderId: "ORD-003", customer: "Karim Hossain", product: "Cotton Crew Neck", amount: 89, status: "Delivered", date: "2026-07-13", email: "karim@example.com" },
      { orderId: "ORD-004", customer: "Shakib Al Hasan", product: "Regular Fit Oxford", amount: 175, status: "Delivered", date: "2026-07-12", email: "shakib@example.com" },
      { orderId: "ORD-005", customer: "Nusrat Jahan", product: "Air Max 270", amount: 320, status: "Cancelled", date: "2026-07-11", email: "nusrat@example.com" },
    ]);

    await seedIfEmpty(reviewsCollection, [
      { id: 1, user: "Rahim U.", product: "T-shirt with Tape Details", rating: 5, comment: "Great quality and fit!", date: "2026-07-10" },
      { id: 2, user: "Fatima K.", product: "Skinny Fit Jeans", rating: 4, comment: "Love the material, true to size.", date: "2026-07-09" },
      { id: 3, user: "Karim H.", product: "Cotton Crew Neck", rating: 3, comment: "Decent for the price.", date: "2026-07-08" },
    ]);

    await seedIfEmpty(categoriesCollection, [
      { name: "T-shirts", slug: "t-shirts", productCount: 45, color: "#8b5cf6" },
      { name: "Jeans", slug: "jeans", productCount: 28, color: "#3b82f6" },
      { name: "Shirts", slug: "shirts", productCount: 34, color: "#22c55e" },
      { name: "Jackets", slug: "jackets", productCount: 18, color: "#f59e0b" },
      { name: "Accessories", slug: "accessories", productCount: 52, color: "#ef4444" },
    ]);

    await seedIfEmpty(couponsCollection, [
      { code: "SUMMER20", discount: 20, type: "percentage", usage: 145, maxUsage: 200, status: "active", expiry: "2026-08-31" },
      { code: "SAVE10", discount: 10, type: "percentage", usage: 320, maxUsage: 500, status: "active", expiry: "2026-09-30" },
      { code: "FLAT500", discount: 500, type: "fixed", usage: 65, maxUsage: 100, status: "active", expiry: "2026-07-31" },
      { code: "WELCOME15", discount: 15, type: "percentage", usage: 412, maxUsage: 1000, status: "expired", expiry: "2026-06-30" },
    ]);

    await seedIfEmpty(inventoryCollection, [
      { name: "T-shirt with Tape Details", sku: "TS-001", stock: 120, minStock: 20, status: "In Stock", category: "T-shirts" },
      { name: "Skinny Fit Jeans", sku: "JN-002", stock: 45, minStock: 15, status: "In Stock", category: "Jeans" },
      { name: "Cotton Crew Neck", sku: "TS-003", stock: 8, minStock: 20, status: "Low Stock", category: "T-shirts" },
      { name: "Regular Fit Oxford", sku: "SH-004", stock: 0, minStock: 10, status: "Out of Stock", category: "Shirts" },
      { name: "Air Max 270", sku: "AC-005", stock: 34, minStock: 10, status: "In Stock", category: "Accessories" },
      { name: "Denim Jacket", sku: "JK-006", stock: 3, minStock: 10, status: "Low Stock", category: "Jackets" },
      { name: "Leather Belt", sku: "AC-007", stock: 67, minStock: 15, status: "In Stock", category: "Accessories" },
    ]);

    await seedIfEmpty(notificationsCollection, [
      { title: "New order placed", message: "Order #ORD-006 has been placed by Fatima Khatun.", type: "order", read: false, createdAt: "2026-07-15T10:30:00Z" },
      { title: "Low stock alert", message: "Cotton Crew Neck is running low (8 left).", type: "alert", read: false, createdAt: "2026-07-14T08:15:00Z" },
      { title: "New user registered", message: "Fahim Ahmed has created an account.", type: "user", read: true, createdAt: "2026-07-13T14:20:00Z" },
      { title: "Review submitted", message: "Rahim U. left a 5-star review.", type: "review", read: true, createdAt: "2026-07-12T09:45:00Z" },
    ]);

    await seedIfEmpty(wishlistCollection, [
      { userEmail: "user@example.com", productId: "1", name: "T-shirt with Tape Details", price: 145, image: "/placeholder.svg", addedAt: "2026-07-10" },
      { userEmail: "user@example.com", productId: "2", name: "Skinny Fit Jeans", price: 240, image: "/placeholder.svg", addedAt: "2026-07-08" },
      { userEmail: "user@example.com", productId: "3", name: "Regular Fit Oxford Shirt", price: 175, image: "/placeholder.svg", addedAt: "2026-07-05" },
    ]);

    await seedIfEmpty(announcementsCollection, [
      { title: "Summer Sale is Live!", content: "Get up to 40% off on all summer collections. Limited time offer.", author: "Admin", views: 1240, status: "active", createdAt: "2026-07-01" },
      { title: "New Arrivals: Winter Collection", content: "Check out our latest winter arrivals with premium fabrics.", author: "Admin", views: 890, status: "active", createdAt: "2026-06-25" },
      { title: "Site Maintenance", content: "Scheduled maintenance on July 20th from 2-4 AM. Site may be unavailable.", author: "Owner", views: 2100, status: "inactive", createdAt: "2026-06-20" },
    ]);

    await seedIfEmpty(apiKeysCollection, [
      { name: "Production API Key", key: "sk_live_prod_key_2026", created: "2026-01-15", lastUsed: "2026-07-15", active: true },
      { name: "Test API Key", key: "sk_test_test_key_2026", created: "2026-03-20", lastUsed: "2026-07-14", active: true },
      { name: "Mobile App Key", key: "sk_live_mobile_key_2026", created: "2026-05-10", lastUsed: "2026-07-10", active: false },
    ]);

    await seedIfEmpty(auditLogsCollection, [
      { action: "User role changed", user: "shakib@example.com", target: "rahim@example.com → admin", date: "2026-07-15T14:32:00Z" },
      { action: "Product deleted", user: "admin@shop.co", target: "T-shirt with Tape Details", date: "2026-07-15T12:10:00Z" },
      { action: "New user registered", user: "fahim@example.com", target: "Self-registration", date: "2026-07-14T09:45:00Z" },
      { action: "Product updated", user: "admin@shop.co", target: "Skinny Fit Jeans → price changed", date: "2026-07-13T16:20:00Z" },
      { action: "Coupon created", user: "owner@shop.co", target: "SUMMER20 - 20% off", date: "2026-07-12T11:00:00Z" },
    ]);

    await seedIfEmpty(emailTemplatesCollection, [
      { name: "Order Confirmation", subject: "Your order #{id} has been confirmed", used: true, lastEdited: "2026-07-10", sent: 2450, openRate: 68, body: "<p>Thank you for your order!</p>" },
      { name: "Shipping Update", subject: "Your order #{id} is on the way!", used: true, lastEdited: "2026-07-08", sent: 1890, openRate: 72, body: "<p>Your order has been shipped.</p>" },
      { name: "Welcome Email", subject: "Welcome to Shop.co, {name}!", used: true, lastEdited: "2026-06-25", sent: 520, openRate: 85, body: "<p>Welcome to our store!</p>" },
      { name: "Password Reset", subject: "Reset your Shop.co password", used: true, lastEdited: "2026-06-20", sent: 180, openRate: 45, body: "<p>Click here to reset your password.</p>" },
      { name: "Abandoned Cart", subject: "Don't forget your items, {name}!", used: false, lastEdited: "2026-07-01", sent: 0, openRate: 0, body: "<p>You left items in your cart.</p>" },
    ]);

    // ─── Orders API ─────────────────────────────────────────────
    app.get("/api/orders", async (req, res) => {
      try {
        const { email } = req.query;
        let result = email ? await ordersCollection.find({ email }).toArray() : await ordersCollection.find().toArray();
        res.json(result);
      } catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    app.post("/api/orders", async (req, res) => {
      try { const r = await ordersCollection.insertOne(req.body); res.status(201).json({ success: true, result: r }); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    app.patch("/api/orders/:id", async (req, res) => {
      try { const r = await ordersCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body }); res.json({ success: true, result: r }); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    app.delete("/api/orders/:id", async (req, res) => {
      try { const r = await ordersCollection.deleteOne({ _id: new ObjectId(req.params.id) }); res.json({ success: true, result: r }); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    // ─── Reviews API ────────────────────────────────────────────
    app.get("/api/reviews", async (req, res) => {
      try { res.json(await reviewsCollection.find().toArray()); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    app.post("/api/reviews", async (req, res) => {
      try { const r = await reviewsCollection.insertOne(req.body); res.status(201).json({ success: true, result: r }); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    // ─── Categories API ─────────────────────────────────────────
    app.get("/api/categories", async (req, res) => {
      try { res.json(await categoriesCollection.find().toArray()); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    app.post("/api/categories", async (req, res) => {
      try { const r = await categoriesCollection.insertOne(req.body); res.status(201).json({ success: true, result: r }); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    // ─── Coupons API ────────────────────────────────────────────
    app.get("/api/coupons", async (req, res) => {
      try { res.json(await couponsCollection.find().toArray()); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    app.post("/api/coupons", async (req, res) => {
      try { const r = await couponsCollection.insertOne(req.body); res.status(201).json({ success: true, result: r }); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    // ─── Inventory API ──────────────────────────────────────────
    app.get("/api/inventory", async (req, res) => {
      try { res.json(await inventoryCollection.find().toArray()); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    app.patch("/api/inventory/:id", async (req, res) => {
      try { const r = await inventoryCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body }); res.json({ success: true, result: r }); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    // ─── Notifications API ──────────────────────────────────────
    app.get("/api/notifications", async (req, res) => {
      try { const { email } = req.query; res.json(email ? await notificationsCollection.find({ $or: [{ email }, { email: { $exists: false } }] }).toArray() : await notificationsCollection.find().toArray()); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    app.patch("/api/notifications/:id", async (req, res) => {
      try { const r = await notificationsCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body }); res.json({ success: true, result: r }); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    // ─── Wishlist API ───────────────────────────────────────────
    app.get("/api/wishlist", async (req, res) => {
      try { const { email } = req.query; res.json(email ? await wishlistCollection.find({ userEmail: email }).toArray() : await wishlistCollection.find().toArray()); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    app.post("/api/wishlist", async (req, res) => {
      try { const r = await wishlistCollection.insertOne(req.body); res.status(201).json({ success: true, result: r }); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    app.delete("/api/wishlist/:id", async (req, res) => {
      try { const r = await wishlistCollection.deleteOne({ _id: new ObjectId(req.params.id) }); res.json({ success: true, result: r }); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    // ─── Announcements API ──────────────────────────────────────
    app.get("/api/announcements", async (req, res) => {
      try { res.json(await announcementsCollection.find().toArray()); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    app.post("/api/announcements", async (req, res) => {
      try { const r = await announcementsCollection.insertOne(req.body); res.status(201).json({ success: true, result: r }); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    // ─── API Keys API ───────────────────────────────────────────
    app.get("/api/api-keys", async (req, res) => {
      try { res.json(await apiKeysCollection.find().toArray()); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    app.post("/api/api-keys", async (req, res) => {
      try { const r = await apiKeysCollection.insertOne(req.body); res.status(201).json({ success: true, result: r }); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    app.delete("/api/api-keys/:id", async (req, res) => {
      try { const r = await apiKeysCollection.deleteOne({ _id: new ObjectId(req.params.id) }); res.json({ success: true, result: r }); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    // ─── Audit Logs API ─────────────────────────────────────────
    app.get("/api/audit-logs", async (req, res) => {
      try { res.json(await auditLogsCollection.find().sort({ date: -1 }).toArray()); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    app.post("/api/audit-logs", async (req, res) => {
      try { const r = await auditLogsCollection.insertOne(req.body); res.status(201).json({ success: true, result: r }); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    // ─── Email Templates API ────────────────────────────────────
    app.get("/api/email-templates", async (req, res) => {
      try { res.json(await emailTemplatesCollection.find().toArray()); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    app.patch("/api/email-templates/:id", async (req, res) => {
      try { const r = await emailTemplatesCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body }); res.json({ success: true, result: r }); }
      catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    // ─── Reports / Dashboard Chart Data ─────────────────────────
    app.get("/api/reports/stats", async (req, res) => {
      try {
        const usersCount = await db.collection("user").countDocuments();
        const productsCount = await allProductsCollection.countDocuments();
        const ordersCount = await ordersCollection.countDocuments();
        const reviewsArr = await reviewsCollection.find().toArray();
        const avgRating = reviewsArr.length ? (reviewsArr.reduce((s, r) => s + r.rating, 0) / reviewsArr.length).toFixed(1) : 0;
        const inventoryArr = await inventoryCollection.find().toArray();
        const lowStock = inventoryArr.filter((i) => i.stock <= i.minStock).length;
        res.json({ usersCount, productsCount, ordersCount, avgRating: Number(avgRating), lowStock });
      } catch (e) { res.status(500).json({ success: false, message: e.message }); }
    });

    app.get("/api/dashboard/stats", async (req, res) => {
      try {
        const usersCollection = db.collection("user");
        const totalProducts = await allProductsCollection.countDocuments();
        const totalUsers = await usersCollection.countDocuments();
        const totalCartItems = await addToCardCollection.countDocuments();
        res.json({ totalProducts, totalUsers, totalCartItems });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch stats" });
      }
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    //
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Wellcome to the Shop-Co Server!");
});

app.listen(port, () => {
  console.log(`Shop-Co listening on port ${port}`);
});
