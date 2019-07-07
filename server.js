const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let xIsNext = true;

io.on('connection', socket => {
  console.log(`${socket.id} was connected`);

  socket.on('playerTakeTurn', coordinate => {
    xIsNext = !xIsNext;
    let { x, y } = coordinate;
    io.emit('playerTakeTurn', { xIsNext, coordinate: { x, y } });
  });

  socket.on('newGame', data => {
    xIsNext = data;
    io.emit('newGame', xIsNext);
  });

  socket.on('disconnect', () => console.log(`${socket.id} was disconnected`));
});

const port = process.env.PORT || 3000;
http.listen(port, () => console.log(`Listening on port ${port}`));
