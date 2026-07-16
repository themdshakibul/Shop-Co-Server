const { Router } = require("express");

module.exports = (collections) => {
  const router = Router();

  router.get("/coupons", async (req, res) => {
    try {
      res.json(await collections.coupons.find().toArray());
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  router.post("/coupons", async (req, res) => {
    try {
      const r = await collections.coupons.insertOne(req.body);
      res.status(201).json({ success: true, result: r });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  return router;
};
