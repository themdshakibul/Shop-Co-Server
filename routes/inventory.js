const { Router } = require("express");

module.exports = (collections, ObjectId) => {
  const router = Router();

  router.get("/inventory", async (req, res) => {
    try {
      res.json(await collections.inventory.find().toArray());
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  router.patch("/inventory/:id", async (req, res) => {
    try {
      const r = await collections.inventory.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body },
      );
      res.json({ success: true, result: r });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  return router;
};
