const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

let client = null;
let collections = null;

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI environment variable is not set");

  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
  });

  await client.connect();
  const db = client.db("Shop-co");

  collections = {
    products: db.collection("Products"),
    addToCard: db.collection("AddToCard"),
    orders: db.collection("Orders"),
    reviews: db.collection("Reviews"),
    categories: db.collection("Categories"),
    coupons: db.collection("Coupons"),
    inventory: db.collection("Inventory"),
    notifications: db.collection("Notifications"),
    wishlist: db.collection("Wishlist"),
    announcements: db.collection("Announcements"),
    apiKeys: db.collection("ApiKeys"),
    auditLogs: db.collection("AuditLogs"),
    emailTemplates: db.collection("EmailTemplates"),
    addresses: db.collection("Addresses"),
    users: db.collection("user"),
  };

  return collections;
}

function getCollections() {
  if (!collections) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return collections;
}

module.exports = { connectDB, getCollections, ObjectId };
