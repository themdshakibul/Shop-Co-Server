const { Router } = require("express");

module.exports = () => {
  const router = Router();

  router.get("/audit-logs", async (req, res) => {
    try {
      const { collections } = req;
      res.json(await collections.auditLogs.find().sort({ date: -1 }).toArray());
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  router.post("/audit-logs", async (req, res) => {
    try {
      const { collections } = req;
      const r = await collections.auditLogs.insertOne(req.body);
      res.status(201).json({ success: true, result: r });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  return router;
};
