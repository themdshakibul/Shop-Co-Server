const { Router } = require("express");

module.exports = (collections, ObjectId) => {
  const router = Router();

  router.get("/all-products", async (req, res) => {
    const result = await collections.products.find().toArray();
    res.json(result);
  });

  router.get("/all-products/:id", async (req, res) => {
    const id = req.params.id;
    const result = await collections.products.findOne({ _id: new ObjectId(id) });
    res.json(result);
  });

  router.post("/all-products", async (req, res) => {
    try {
      const product = req.body;
      const result = await collections.products.insertOne(product);
      res.status(201).json({ success: true, result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to add product" });
    }
  });

  router.patch("/all-products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid id" });
      }
      const result = await collections.products.updateOne(
        { _id: new ObjectId(id) },
        { $set: updates },
      );
      res.json({ success: true, result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to update product" });
    }
  });

  router.delete("/all-products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid id" });
      }
      const result = await collections.products.deleteOne({ _id: new ObjectId(id) });
      res.json({ success: true, result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to delete product" });
    }
  });

  router.get("/all-reviews", async (req, res) => {
    const result = await collections.products.find().toArray();
    res.json(result);
  });

  return router;
};
