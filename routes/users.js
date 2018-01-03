const express = require("express");
const router = express.Router();
require('locus');

const db = require("../static/js/db.js");
const modelName = "User";

/*
  '/users'
*/
router
  .route("")
  .get((req, res, next) => {
    return res.sendStatus(200);
  })
  .post((req, res, next) => {
    // res.sendStatus(200)
    // console.log("POST: " + db)
    db.insertModel(modelName, req.body)
      .then(data => (
        res.sendStatus(200)
      ))
      .catch(err => (
        res.sendStatus(err)
      ));
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
