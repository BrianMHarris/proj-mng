const express = require("express");
const router = express.Router();

// instead of app.get...
router.get("/projects", (req, res, next) => {
  return res.sendStatus(200);
});

module.exports = router;
