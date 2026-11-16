const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  createShortUrl,getMyUrls,
} = require("../controllers/urlController");

router.get(
  "/my-urls",
  authMiddleware,
  getMyUrls
);

router.get("/test", (req, res) => {
  res.json({
    message: "URL Route Working",
  });
});

router.post(
  "/create",
  authMiddleware,
  createShortUrl
);

module.exports = router;