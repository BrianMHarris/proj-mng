const express = require("express");
const router = express.Router();

const db = require("../static/js/db.js")

/*
  '/users'
*/
router
  .route("")
  .get((req, res, next) => {
    return res.sendStatus(200);
  })
  .post((req, res, next) => {
    return res.redirect("/users");
  });


/*
  '/users/:name'
*/
router
  .route("/:name")
  .patch((req, res, next) => {
    return res.sendStatus(200);
  })
  .delete((req, res, next) => {
    return res.redirect("/users");
  });

module.exports = router;
