const { Router } = require("express");

module.exports = () => {
  const router = Router();

  router.get("/api-keys", async (req, res) => {
    try {
      const { collections } = req;
      res.json(await collections.apiKeys.find().toArray());
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  router.post("/api-keys", async (req, res) => {
    try {
      const { collections } = req;
      const r = await collections.apiKeys.insertOne(req.body);
      res.status(201).json({ success: true, result: r });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  router.delete("/api-keys/:id", async (req, res) => {
    try {
      const { collections, ObjectId } = req;
      const r = await collections.apiKeys.deleteOne({ _id: new ObjectId(req.params.id) });
      res.json({ success: true, result: r });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  return router;
};
