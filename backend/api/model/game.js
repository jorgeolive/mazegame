const { Maze } = require("./maze");

class Game {

    constructor(id, width, height, maxPlayers) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.maxPlayers = maxPlayers;
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

    allPlayersJoined(){
        return this.maxPlayers === this.players.length;
    }

    init() {
        this.maze = new Maze(this.width, this.height);

        if (!allPlayersJoined) {
            throw new Error("Waiting for players to join");
        }

        this.players.forEach(plyr => plyr.setPosition(this.maze.getRandomCell()));
    }

    start(){
        this.isStarted = true;
    }
}

module.exports = {
    Game: Game
}