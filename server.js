const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const { Players } = require("./utils/Players");

let xIsNext = true;
let players = new Players();

io.on("connection", socket => {
  console.log(`${socket.id} was connected`);

  socket.on("newUserJoin", (data, callback) => {
    let onlineUserList = players.getPlayerList(data.room);

    if (onlineUserList.includes(data.username)) {
      return callback({
        status: "error",
        payload: {
          msg: "This name has been taken, please choose another name!"
        }
      });
    }

    socket.join(data.room);
    players.remove(socket.id);
    players.add(socket.id, data.username, data.room);

    console.log(`${data.username} joined room ${data.room}`);
    callback({
      status: "ok",
      payload: {
        id: socket.id
      }
    });
  });

  socket.on("playerTakeTurn", coordinate => {
    xIsNext = !xIsNext;
    let { x, y } = coordinate;
    io.emit("playerTakeTurn", { xIsNext, coordinate: { x, y } });
  });

  socket.on("newGame", data => {
    xIsNext = data;
    io.emit("newGame", xIsNext);
  });

  socket.on("logout", (data, callback) => {
    let player = players.remove(data.id);

    if (player) {
      console.log(`${player.name} is logout`);
      callback();
    }
  });

  socket.on("disconnect", () => console.log(`${socket.id} was disconnected`));
});

const port = process.env.PORT || 3000;
http.listen(port, () => console.log(`Listening on port ${port}`));
