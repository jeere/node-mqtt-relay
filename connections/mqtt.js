var mqtt = require("mqtt");
//var app = require("../app");

const topic = process.env.MQTT_PUMP_TOPIC;
const client = mqtt.connect(process.env.MQTT_IP_ADDRESS);
const acceptedTopics = [process.env.MQTT_PUMP_TOPIC, "SOMETHING-IN-FUTURE"];
const minutes = 60;
const the_interval = minutes * 60 * 1000;
const run_pump_for = 20000;

client.on("connect", function () {
  client.subscribe(topic, function (err) {
    if (!err) {
      run_pump();
    } else {
      console.log(err);
    }
  });
});

client.on("message", function (topic, message) {
  var datetime = new Date();
  console.info(
    `${datetime}: \nMQTT Data Retrieved | Topic: ${topic} | Data: ${message}\n`
  );

  var msgObj = { topic: topic, message: message };
  //app.io.emit("broadcast data", msgObj);
});

function publish_mqtt_message(topic, message, res) {
  if (acceptedTopics.findIndex((k) => k == topic) != -1) {
    client.publish(topic, message, (err) => {
      if (err) {
        res.json("error");
      } else {
        res.json({ topic: topic, message: message });
      }
    });
  } else {
    res.json("topic not accepted");
  }
}

//Run always at the fresh boot
setInterval(function () {
  run_pump();
}, the_interval);

function run_pump() {
  var datetime = new Date();
  console.log(`${datetime}: \nStart the pump\n`);
  client.publish(topic, "1");
  setTimeout(() => {
    var datetime = new Date();
    console.log(`${datetime}: \nClose the pump\n`);
    client.publish(topic, "0");
  }, run_pump_for);
}

module.exports = {
  client,
  run_pump,
  publish_mqtt_message,
};
