const { Router } = require("express");

module.exports = () => {
  const router = Router();

  router.get("/users", async (req, res) => {
    try {
      const { collections } = req;
      const users = await collections.users
        .find({}, { projection: { password: 0 } })
        .toArray();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
  });

  router.patch("/users/:id/role", async (req, res) => {
    try {
      const { collections, ObjectId } = req;
      const { id } = req.params;
      const { role } = req.body;
      const result = await collections.users.updateOne(
        { _id: new ObjectId(id) },
        { $set: { role } },
      );
      res.json({ success: true, result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to update role" });
    }
  });

  return router;
};
