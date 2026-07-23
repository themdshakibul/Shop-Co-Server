const { Router } = require("express");

module.exports = () => {
  const router = Router();

  router.get("/reports/stats", async (req, res) => {
    try {
      const { collections } = req;
      const usersCount = await collections.users.countDocuments();
      const productsCount = await collections.products.countDocuments();
      const ordersCount = await collections.orders.countDocuments();
      const reviewsArr = await collections.reviews.find().toArray();
      const avgRating = reviewsArr.length
        ? (reviewsArr.reduce((s, r) => s + r.rating, 0) / reviewsArr.length).toFixed(1)
        : 0;
      const inventoryArr = await collections.inventory.find().toArray();
      const lowStock = inventoryArr.filter((i) => i.stock <= i.minStock).length;
      res.json({ usersCount, productsCount, ordersCount, avgRating: Number(avgRating), lowStock });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  router.get("/dashboard/stats", async (req, res) => {
    try {
      const { collections } = req;
      const totalProducts = await collections.products.countDocuments();
      const totalUsers = await collections.users.countDocuments();
      const totalCartItems = await collections.addToCard.countDocuments();
      res.json({ totalProducts, totalUsers, totalCartItems });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to fetch stats" });
    }
  });

  return router;
};
