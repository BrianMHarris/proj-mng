require('dotenv').config()

const express = require("express");
const methodOverride = require("method-override");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const userRoutes = require("./routes/users.js");
const projectRoutes = require("./routes/projects.js");

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(morgan("tiny"));

// set the body parser to use json and encode it
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// override Post method!
app.use(methodOverride("_method"));

// Now let's tell our app about those routes we made!
app.use("/users", userRoutes);
app.use("/projects", projectRoutes);

app.get("/", (req, res, next) => {
  return res.redirect("/projects")
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  return next(err);
});

/*
  error handler - for a handler with four parameters,
  the first is assumed to be an error passed by another
  handler's "next"
 */
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  return res.render("error", {
    message: err.message,
    /*
     if we're in development mode, include stack trace (full error object)
     otherwise, it's an empty object so the user doesn't see all of that
    */
    error: app.get("env") === "development" ? err : {}
  });
});

app.listen(3000, function() {
  console.log("Server is listening on port 3000");
});

module.exports = app;

