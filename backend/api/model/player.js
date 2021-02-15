const Rx = require("rxjs");

class Player {
  constructor(id, name) {
    this.name = name;
    this.id = id;
    this.colorCode = this.getRandomColor();
    this.isAlive = true;
    this.playerEvents$ = new Rx.Subject();
    this.points = 0;
    //this.hasJoined = false;
  }

  asSerializable = () => {
    return {
      id: this.id,
      name: this.name,
      colorCode : this.colorCode,
      points: this.points
    }
  }

  captureGoodie = (increment) => {
    console.log("increment    :", increment);
    this.points = this.points + increment;
    console.log("new player points:", this.points);
    this.playerEvents$.next({eventType : "pointsUpdated", player: this.asSerializable()})
  }

  getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  kill = () => {
    this.isAlive = false;
    this.playerEvents$.next({eventType : "playerCaught", player : this.id})
  }
}

module.exports = {
  Player: Player
}
