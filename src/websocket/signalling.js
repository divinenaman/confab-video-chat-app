const WebSocket = require("ws");

let rooms = {};

const initialze_websocket = (server) => {
  const ws = new WebSocket.Server({ server });
  var i = 1;

  ws.on("connection", function connection(conn) {
    console.log("client connected");
    conn.on("message", function incoming(msg) {
      let data = JSON.parse(msg);

      if (data.type == "enterlobby") {
        console.log(data.roomId);
        var { roomId } = data;
        var userId = i;
        i += 1;
        if (!rooms.hasOwnProperty(roomId)) rooms[roomId] = {};
        rooms[roomId][userId] = conn;
        var connA = rooms[roomId][userId];
        send(connA, { type: "creds", userId });
      } else if (data.type == "users") {
        console.log("users:");
        var { roomId } = data;
        var users = [];
        if (rooms.hasOwnProperty(roomId)) {
          checkAllUserConnection(roomId);
          users = Object.keys(rooms[roomId]);
        }
        broadcast("", { type: "users", users, roomId });
      } else if (data.type == "offer") {
        console.log("received: offer");
        var { roomId, userA, userB } = data;
        console.log(rooms);
        if (checkUserConnection(roomId, userA)) {
          var connA = rooms[roomId][userA];
          send(connA, { type: "offer", userB, offer: data.offer });
        } else {
          send(conn, { type: "disconnect", userId: userA, roomId });
        }
      } else if (data.type == "answer") {
        console.log("received: answer");

        var { roomId, userA, userB } = data;
        if (checkUserConnection(roomId, userA)) {
          var connA = rooms[roomId][userA];
          send(connA, { type: "answer", userA, answer: data.answer, userB });
        } else {
          send(conn, { type: "disconnect", userId: userA, roomId });
        }
      } else if (data.type == "disconnect") {
        console.log("received: disconnect");
        broadcast(data.userId, data);
      } else if ((data.type = "candidate")) {
        console.log("received: candidate");
        console.log(data.userId);
        broadcast(data.userId, data);
      }
    });
  });
};

function checkAllUserConnection(roomId) {
  let clients = Object.keys(rooms[roomId]);
  clients.forEach((user) => {
    if (rooms[roomId][user].readyState !== WebSocket.OPEN) {
      delete rooms[roomId][user];
    }
  });
}

function checkUserConnection(roomId, user) {
  if (rooms[roomId][user].readyState === WebSocket.OPEN) {
    return true;
  }
  delete rooms[roomId][user];
  return false;
}

function send(con, message) {
  con.send(JSON.stringify(message));
}

function broadcast(userId, message) {
  var { roomId, userId } = message;
  Object.keys(rooms[roomId]).forEach((uid) => {
    if (userId == "" || userId != uid) send(rooms[roomId][uid], message);
  });
}

setInterval(() => {
  var r = Object.keys(rooms);
  for (const room of r) {
    var u = Object.keys(rooms[room]);
    for (const uid of u) {
      if (rooms[room][uid].readyState !== WebSocket.OPEN) {
        delete rooms[room][uid];
        broadcast("", { type: "disconnect", roomId: room, userId: uid });
      }
    }
  }
}, 2000);

module.exports = initialze_websocket;
