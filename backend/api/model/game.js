const { Maze } = require("./maze");

class Game {

    constructor(gameid, width, height, maxPlayers, numberOfMonsters) {
        this.id = gameid;
        this.maze = new Maze(width, height);
        this.maxPlayers = maxPlayers;
        this.numberOfMonsters = numberOfMonsters;
        this.players = [];
        this.monsters = [];
        this.isStarted = false;
        this.allPlayersJoined = false;
    }

    addPlayer(player) {
        if (this.players.length = this.maxPlayers) {
            throw new Error('Max number of players reached.');
        }

        if (this.players.length + 1 == this.maxPlayers) {
            this.allPlayersJoined = true;
        }

        this.players = [...this.players, player];
    }

    getPlayer(playerId){
        return this.players.find(elem => elem.id = playerId)[0];
    }

    start() {
        if (!allPlayersJoined) {
            throw new Error("Waiting for players to join");
        }

        this.isStarted = true;
        this.players.forEach(plyr => plyr.setPosition(this.maze.getRandomCell()));
    }
}

module.exports = {
    Game: Game
}