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
    // this route currently doesn't do anything
    return res.sendStatus(400);
  })
  .post((req, res, next) => {
    // res.sendStatus(200)
    // console.log("POST: " + db)
    db.insertModel(modelName, req.body)
      .then(data => (
        res.sendStatus(200)
      ))
      .catch(err => {
        // if the error is a normal code, send it
        if (typeof err === 'number')
          res.sendStatus(err)
        // otherwise it's likely a server error
        res.sendStatus(500);
        console.log(err)
      });
  });


/*
  '/users/:name'
*/
router
  .route("/:name")
  .get((req, res, next) => {
    db.findModel(modelName, {username: req.params.name})
      .then(data => {
        let user = data;
        res.status(200).send(JSON.stringify(user));
      })
      .catch(err => {
        if (typeof err === 'number')
          res.sendStatus(err);
        // otherwise it's likely a server error
        res.sendStatus(500);
      });
  })
  .patch((req, res, next) => {
    return res.sendStatus(200);
  })
  .delete((req, res, next) => {
    return res.redirect("/users");
  });

module.exports = router;
