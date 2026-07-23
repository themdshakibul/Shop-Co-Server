const { Router } = require("express");

module.exports = () => {
  const router = Router();

  router.get("/addresses", async (req, res) => {
    try {
      const { collections } = req;
      const { email } = req.query;
      let result;
      if (email) {
        result = await collections.addresses.find({ userEmail: email }).toArray();
      } else {
        result = await collections.addresses.find().toArray();
      }
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to fetch addresses" });
    }
  });

  router.post("/addresses", async (req, res) => {
    try {
      const { collections } = req;
      const address = req.body;
      if (address.default) {
        await collections.addresses.updateMany(
          { userEmail: address.userEmail },
          { $set: { default: false } },
        );
      }
      const result = await collections.addresses.insertOne(address);
      res.status(201).json({ success: true, result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to add address" });
    }
  });

  router.patch("/addresses/:id", async (req, res) => {
    try {
      const { collections, ObjectId } = req;
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid id" });
      }
      const updates = req.body;
      if (updates.default) {
        const existing = await collections.addresses.findOne({ _id: new ObjectId(id) });
        await collections.addresses.updateMany(
          { userEmail: existing.userEmail },
          { $set: { default: false } },
        );
      }
      const result = await collections.addresses.updateOne(
        { _id: new ObjectId(id) },
        { $set: updates },
      );
      res.json({ success: true, result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to update address" });
    }
  });

  router.delete("/addresses/:id", async (req, res) => {
    try {
      const { collections, ObjectId } = req;
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid id" });
      }
      const result = await collections.addresses.deleteOne({ _id: new ObjectId(id) });
      res.json({ success: true, result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to delete address" });
    }
  });

  return router;
};
