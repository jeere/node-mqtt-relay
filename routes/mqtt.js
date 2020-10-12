var express = require("express");
var router = express.Router();
const { publish_mqtt_message } = require("../connections/mqtt");

router.get("/", function (req, res, next) {
  res.render("index", { title: "MQTT" });
});

router.post("/", function (req, res) {
  var topic = req.body.topic;
  var message = req.body.message;
  var res_obj = {};
  publish_mqtt_message(topic, message, res_obj);
  res.json(res_obj);
});

module.exports = router;
