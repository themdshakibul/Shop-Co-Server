const { Router } = require("express");

module.exports = (collections, ObjectId) => {
  const router = Router();

  router.get("/notifications", async (req, res) => {
    try {
      const { email } = req.query;
      res.json(
        email
          ? await collections.notifications
              .find({ $or: [{ email }, { email: { $exists: false } }] })
              .toArray()
          : await collections.notifications.find().toArray(),
      );
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  router.patch("/notifications/:id", async (req, res) => {
    try {
      const r = await collections.notifications.updateOne(
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
