const { Router } = require("express");

module.exports = () => {
  const router = Router();

  router.get("/shipping-settings", async (req, res) => {
    try {
      res.json({
        freeShippingMin: 100,
        standard: { label: "Standard", days: "5-7 business days", cost: 0 },
        express: { label: "Express", days: "2-3 business days", cost: 12.99 },
        returns: "30-day return policy. Items must be unworn with tags attached.",
      });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  });

  return router;
};
