async function seedIfEmpty(collections) {
  const seeds = [
    {
      collection: collections.orders,
      data: [
        { orderId: "ORD-001", customer: "Rahim Uddin", product: "T-shirt with Tape Details", amount: 145, status: "Processing", date: "2026-07-15", email: "rahim@example.com" },
        { orderId: "ORD-002", customer: "Fatima Khatun", product: "Skinny Fit Jeans", amount: 240, status: "Shipped", date: "2026-07-14", email: "fatima@example.com" },
        { orderId: "ORD-003", customer: "Karim Hossain", product: "Cotton Crew Neck", amount: 89, status: "Delivered", date: "2026-07-13", email: "karim@example.com" },
        { orderId: "ORD-004", customer: "Shakib Al Hasan", product: "Regular Fit Oxford", amount: 175, status: "Delivered", date: "2026-07-12", email: "shakib@example.com" },
        { orderId: "ORD-005", customer: "Nusrat Jahan", product: "Air Max 270", amount: 320, status: "Cancelled", date: "2026-07-11", email: "nusrat@example.com" },
      ],
    },
    {
      collection: collections.reviews,
      data: [
        { id: 1, user: "Rahim U.", product: "T-shirt with Tape Details", rating: 5, comment: "Great quality and fit!", date: "2026-07-10" },
        { id: 2, user: "Fatima K.", product: "Skinny Fit Jeans", rating: 4, comment: "Love the material, true to size.", date: "2026-07-09" },
        { id: 3, user: "Karim H.", product: "Cotton Crew Neck", rating: 3, comment: "Decent for the price.", date: "2026-07-08" },
      ],
    },
    {
      collection: collections.categories,
      data: [
        { name: "T-shirts", slug: "t-shirts", productCount: 45, color: "#8b5cf6" },
        { name: "Jeans", slug: "jeans", productCount: 28, color: "#3b82f6" },
        { name: "Shirts", slug: "shirts", productCount: 34, color: "#22c55e" },
        { name: "Jackets", slug: "jackets", productCount: 18, color: "#f59e0b" },
        { name: "Accessories", slug: "accessories", productCount: 52, color: "#ef4444" },
      ],
    },
    {
      collection: collections.coupons,
      data: [
        { code: "SUMMER20", discount: 20, type: "percentage", usage: 145, maxUsage: 200, status: "active", expiry: "2026-08-31" },
        { code: "SAVE10", discount: 10, type: "percentage", usage: 320, maxUsage: 500, status: "active", expiry: "2026-09-30" },
        { code: "FLAT500", discount: 500, type: "fixed", usage: 65, maxUsage: 100, status: "active", expiry: "2026-07-31" },
        { code: "WELCOME15", discount: 15, type: "percentage", usage: 412, maxUsage: 1000, status: "expired", expiry: "2026-06-30" },
      ],
    },
    {
      collection: collections.inventory,
      data: [
        { name: "T-shirt with Tape Details", sku: "TS-001", stock: 120, minStock: 20, status: "In Stock", category: "T-shirts" },
        { name: "Skinny Fit Jeans", sku: "JN-002", stock: 45, minStock: 15, status: "In Stock", category: "Jeans" },
        { name: "Cotton Crew Neck", sku: "TS-003", stock: 8, minStock: 20, status: "Low Stock", category: "T-shirts" },
        { name: "Regular Fit Oxford", sku: "SH-004", stock: 0, minStock: 10, status: "Out of Stock", category: "Shirts" },
        { name: "Air Max 270", sku: "AC-005", stock: 34, minStock: 10, status: "In Stock", category: "Accessories" },
        { name: "Denim Jacket", sku: "JK-006", stock: 3, minStock: 10, status: "Low Stock", category: "Jackets" },
        { name: "Leather Belt", sku: "AC-007", stock: 67, minStock: 15, status: "In Stock", category: "Accessories" },
      ],
    },
    {
      collection: collections.notifications,
      data: [
        { title: "New order placed", message: "Order #ORD-006 has been placed by Fatima Khatun.", type: "order", read: false, createdAt: "2026-07-15T10:30:00Z" },
        { title: "Low stock alert", message: "Cotton Crew Neck is running low (8 left).", type: "alert", read: false, createdAt: "2026-07-14T08:15:00Z" },
        { title: "New user registered", message: "Fahim Ahmed has created an account.", type: "user", read: true, createdAt: "2026-07-13T14:20:00Z" },
        { title: "Review submitted", message: "Rahim U. left a 5-star review.", type: "review", read: true, createdAt: "2026-07-12T09:45:00Z" },
      ],
    },
    {
      collection: collections.wishlist,
      data: [
        { userEmail: "user@example.com", productId: "1", name: "T-shirt with Tape Details", price: 145, image: "/placeholder.svg", addedAt: "2026-07-10" },
        { userEmail: "user@example.com", productId: "2", name: "Skinny Fit Jeans", price: 240, image: "/placeholder.svg", addedAt: "2026-07-08" },
        { userEmail: "user@example.com", productId: "3", name: "Regular Fit Oxford Shirt", price: 175, image: "/placeholder.svg", addedAt: "2026-07-05" },
      ],
    },
    {
      collection: collections.announcements,
      data: [
        { title: "Summer Sale is Live!", content: "Get up to 40% off on all summer collections. Limited time offer.", author: "Admin", views: 1240, status: "active", createdAt: "2026-07-01" },
        { title: "New Arrivals: Winter Collection", content: "Check out our latest winter arrivals with premium fabrics.", author: "Admin", views: 890, status: "active", createdAt: "2026-06-25" },
        { title: "Site Maintenance", content: "Scheduled maintenance on July 20th from 2-4 AM. Site may be unavailable.", author: "Owner", views: 2100, status: "inactive", createdAt: "2026-06-20" },
      ],
    },
    {
      collection: collections.apiKeys,
      data: [
        { name: "Production API Key", key: "sk_live_prod_key_2026", created: "2026-01-15", lastUsed: "2026-07-15", active: true },
        { name: "Test API Key", key: "sk_test_test_key_2026", created: "2026-03-20", lastUsed: "2026-07-14", active: true },
        { name: "Mobile App Key", key: "sk_live_mobile_key_2026", created: "2026-05-10", lastUsed: "2026-07-10", active: false },
      ],
    },
    {
      collection: collections.auditLogs,
      data: [
        { action: "User role changed", user: "shakib@example.com", target: "rahim@example.com → admin", date: "2026-07-15T14:32:00Z" },
        { action: "Product deleted", user: "admin@shop.co", target: "T-shirt with Tape Details", date: "2026-07-15T12:10:00Z" },
        { action: "New user registered", user: "fahim@example.com", target: "Self-registration", date: "2026-07-14T09:45:00Z" },
        { action: "Product updated", user: "admin@shop.co", target: "Skinny Fit Jeans → price changed", date: "2026-07-13T16:20:00Z" },
        { action: "Coupon created", user: "owner@shop.co", target: "SUMMER20 - 20% off", date: "2026-07-12T11:00:00Z" },
      ],
    },
    {
      collection: collections.emailTemplates,
      data: [
        { name: "Order Confirmation", subject: "Your order #{id} has been confirmed", used: true, lastEdited: "2026-07-10", sent: 2450, openRate: 68, body: "<p>Thank you for your order!</p>" },
        { name: "Shipping Update", subject: "Your order #{id} is on the way!", used: true, lastEdited: "2026-07-08", sent: 1890, openRate: 72, body: "<p>Your order has been shipped.</p>" },
        { name: "Welcome Email", subject: "Welcome to Shop.co, {name}!", used: true, lastEdited: "2026-06-25", sent: 520, openRate: 85, body: "<p>Welcome to our store!</p>" },
        { name: "Password Reset", subject: "Reset your Shop.co password", used: true, lastEdited: "2026-06-20", sent: 180, openRate: 45, body: "<p>Click here to reset your password.</p>" },
        { name: "Abandoned Cart", subject: "Don't forget your items, {name}!", used: false, lastEdited: "2026-07-01", sent: 0, openRate: 0, body: "<p>You left items in your cart.</p>" },
      ],
    },
  ];

  for (const { collection, data } of seeds) {
    const count = await collection.countDocuments();
    if (count === 0 && data.length > 0) {
      await collection.insertMany(data);
    }
  }
}

module.exports = { seedIfEmpty };
