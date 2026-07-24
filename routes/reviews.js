const { Router } = require("express");

module.exports = () => {
  const router = Router();

  router.get("/reviews", async (req, res) => {
    try {
      const { collections } = req;
      const { email } = req.query;
      const result = email
        ? await collections.reviews.find({ user: email }).toArray()
        : await collections.reviews.find().toArray();
      res.json(result);
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  router.post("/reviews", async (req, res) => {
    try {
      const { collections } = req;
      const r = await collections.reviews.insertOne(req.body);
      res.status(201).json({ success: true, result: r });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  return router;
};
