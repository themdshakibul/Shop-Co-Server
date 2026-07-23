const { Router } = require("express");

module.exports = () => {
  const router = Router();

  router.get("/orders", async (req, res) => {
    try {
      const { collections } = req;
      const { email } = req.query;
      const result = email
        ? await collections.orders.find({ email }).toArray()
        : await collections.orders.find().toArray();
      res.json(result);
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  router.post("/orders", async (req, res) => {
    try {
      const { collections } = req;
      const r = await collections.orders.insertOne(req.body);
      res.status(201).json({ success: true, result: r });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  router.patch("/orders/:id", async (req, res) => {
    try {
      const { collections, ObjectId } = req;
      const r = await collections.orders.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body },
      );
      res.json({ success: true, result: r });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  router.delete("/orders/:id", async (req, res) => {
    try {
      const { collections, ObjectId } = req;
      const r = await collections.orders.deleteOne({ _id: new ObjectId(req.params.id) });
      res.json({ success: true, result: r });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  return router;
};
