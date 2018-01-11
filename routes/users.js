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
    db.insertModel(modelName, req.body)
      .then(data => (
        res.status(201).send(data)
      ))
      .catch(err => {
        // if the error is a normal code, send it
        if (typeof err === 'number')
          res.sendStatus(err)
        // otherwise it's likely a server error
        res.sendStatus(500);
      });
  });

/*
  '/users/:name'
*/
router
  .route("/:name")
  .get((req, res, next) => {
    db.findModel(modelName, {username: req.params.name})
      .then(data => { // the search succeeded...
        if (data) { // ...and found the document
          // prepare the user data to send back
          var user = {
            username: data.username,
            email: data.email
          }

          res.status(200).send(user);
        } else { // ...but didn't find the document
          res.sendStatus(404);
        }
      })
      .catch(err => {
        if (typeof err === 'number') {
          res.sendStatus(err);
        } else {
          // otherwise it's likely a server error
          res.sendStatus(500);
        }
      });
  })
  .patch((req, res, next) => { // UPDATE
    return res.sendStatus(200);
  })
  .delete((req, res, next) => {
    return res.redirect("/users");
  });

module.exports = router;
