const { Router } = require("express");

module.exports = (collections, ObjectId) => {
  const router = Router();

  router.get("/add-to-card", async (req, res) => {
    try {
      const { email } = req.query;
      let result;
      if (email) {
        result = await collections.addToCard.find({ userEmail: email }).toArray();
      } else {
        result = await collections.addToCard.find().toArray();
      }
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to fetch cart items!" });
    }
  });

  router.post("/add-to-card", async (req, res) => {
    try {
      const cartItem = req.body;
      const { productId, userEmail, size, color } = cartItem;

      const isExist = await collections.addToCard.findOne({
        userEmail,
        productId,
        size,
        color,
      });

      if (isExist) {
        return res.status(400).json({
          success: false,
          message: "This specific variant is already added to your cart!",
        });
      }

      const result = await collections.addToCard.insertOne(cartItem);
      res.status(201).json({ success: true, result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to add product to cart!" });
    }
  });

  router.patch("/add-to-card/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid item id!" });
      }

      const result = await collections.addToCard.updateOne(
        { _id: new ObjectId(id) },
        { $set: { quantity } },
      );
      res.status(200).json({ success: true, result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to update quantity!" });
    }
  });

  router.delete("/add-to-card/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid item id!" });
      }
      const result = await collections.addToCard.deleteOne({ _id: new ObjectId(id) });
      res.status(200).json({ success: true, result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to remove item!" });
    }
  });

  return router;
};
