class Players {
  constructor() {
    this.players = [];
  }

  add(id, name, room) {
    let player = { id, name, room };
    this.players.push(player);
    return player;
  }

  remove(id) {
    let player = this.getById(id);

    if (player) {
      this.players = this.players.filter(player => player.id !== id);
    }

    return player;
  }

  getById(id) {
    return this.players.filter(player => player.id === id)[0];
  }

  getByName(name) {
    return this.players.filter(player => player.name === name)[0];
  }

  getPlayerList(room) {
    let players = this.players.filter(player => player.room === room);
    return players.map(player => player.name);
  }

  getRoomList() {
    let allRooms = this.players.map(player => player.room);
    return allRooms.filter(
      (room, index, allRooms) => allRooms.indexOf(room) == index
    );
  }
}

module.exports = { Players };
