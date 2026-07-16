const { Router } = require("express");

module.exports = (collections) => {
  const router = Router();

  router.get("/reviews", async (req, res) => {
    try {
      res.json(await collections.reviews.find().toArray());
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  router.post("/reviews", async (req, res) => {
    try {
      const r = await collections.reviews.insertOne(req.body);
      res.status(201).json({ success: true, result: r });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  return router;
};
