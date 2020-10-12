var io = require("socket.io")();
var sockets = {};
sockets.io = io;

io.on("connection", function (socket) {
  console.log(socket.id + " - Connected");
  socket.on("disconnect", function () {
    console.log(socket.id + " - Disconnected");
  });
  socket.on("reconnect", function () {
    console.log(socket.id + " - Reconnected");
  });
});

module.exports = sockets;
