var express = require("express");
var router = express.Router();
const { publish_mqtt_message } = require("../connections/mqtt");

router.post("/", function (req, res) {
  var topic = req.body.topic;
  var message = req.body.message;
  console.log("Received topic:" + topic + ", message:" + message);

  var msgObj = { topic: topic, message: message };
  req.app.io.emit("broadcast data", msgObj);

  publish_mqtt_message(topic, message, res);
});

router.get("/", function (req, res, next) {
  //Render the post example page
  res.render("post", { title: "Post datax" });
});

module.exports = router;
