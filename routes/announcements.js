const { Router } = require("express");

module.exports = (collections) => {
  const router = Router();

  router.get("/announcements", async (req, res) => {
    try {
      res.json(await collections.announcements.find().toArray());
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  router.post("/announcements", async (req, res) => {
    try {
      const r = await collections.announcements.insertOne(req.body);
      res.status(201).json({ success: true, result: r });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  return router;
};
