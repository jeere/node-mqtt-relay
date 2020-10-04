var cookieParser = require('cookie-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var createError = require('http-errors');
var dotenv = require('dotenv').config()
var express = require('express');
var logger = require('morgan');
var path = require('path');
var mqtt = require('mqtt');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use('/', indexRouter);
app.use('/users', usersRouter);

const topic = process.env.MQTT_PUMP_TOPIC;
const client = mqtt.connect(process.env.MQTT_IP_ADDRESS,);
const message = JSON.stringify({ "first": "item1", "second": "item2" });
const acceptedTopics = [process.env.MQTT_PUMP_TOPIC,"temperature","test"];

client.on('connect', function() {
  client.subscribe(topic, function(err) {
    if (!err) {
        client.publish(topic, message);
    } else {
        console.log(err);
    }
  })
});

client.on('message', function(topic, message) {
  console.info(`MQTT Data Retrieved | Topic: ${topic} | Data: ${message}`);
});

var minutes = 60, the_interval = minutes * 60 * 1000, run_pump = 15000;
setInterval(function() {
    console.log("Start the pump");
    client.publish(topic, "1");
    setTimeout(() => {
      console.log("Close the pump");
      client.publish(topic, "0");
    }, run_pump);
}, the_interval);

app.post('/mqtt',  function(req, res) {

  var topic = req.body.topic;
  var message = req.body.message;

  if(acceptedTopics.findIndex(k => k==topic)!=-1){
    client.publish(topic, message, (err) => {
      if(err){
        res.json("error");
      }else{
        res.json({"topic":topic,"message":message});
      };
    });
  }else{
    res.json("topic not accepted");
  }
});

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
