const { Router } = require("express");

module.exports = () => {
  const router = Router();

  router.get("/categories", async (req, res) => {
    try {
      const { collections } = req;
      res.json(await collections.categories.find().toArray());
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  router.post("/categories", async (req, res) => {
    try {
      const { collections } = req;
      const r = await collections.categories.insertOne(req.body);
      res.status(201).json({ success: true, result: r });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  return router;
};
