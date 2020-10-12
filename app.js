var cookieParser = require("cookie-parser");
var createError = require("http-errors");
var dotenv = require("dotenv").config();
var express = require("express");
var logger = require("morgan");
var path = require("path");
var app = express();
var indexRouter = require("./routes/index");
var postRouter = require("./routes/post");
var mqttRouter = require("./routes/mqtt");

app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/post", postRouter);
app.use("/mqtt", mqttRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
