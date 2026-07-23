const { Router } = require("express");

module.exports = () => {
  const router = Router();

  router.get("/email-templates", async (req, res) => {
    try {
      const { collections } = req;
      res.json(await collections.emailTemplates.find().toArray());
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  router.patch("/email-templates/:id", async (req, res) => {
    try {
      const { collections, ObjectId } = req;
      const r = await collections.emailTemplates.updateOne(
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
