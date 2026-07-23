const { Router } = require("express");

module.exports = () => {
  const router = Router();

  router.get("/wishlist", async (req, res) => {
    try {
      const { collections } = req;
      const { email } = req.query;
      res.json(
        email
          ? await collections.wishlist.find({ userEmail: email }).toArray()
          : await collections.wishlist.find().toArray(),
      );
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  router.post("/wishlist", async (req, res) => {
    try {
      const { collections } = req;
      const r = await collections.wishlist.insertOne(req.body);
      res.status(201).json({ success: true, result: r });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  router.delete("/wishlist/:id", async (req, res) => {
    try {
      const { collections, ObjectId } = req;
      const r = await collections.wishlist.deleteOne({ _id: new ObjectId(req.params.id) });
      res.json({ success: true, result: r });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  return router;
};
