const { GameEngine } = require("../../game-engine");
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

        this.engine = new GameEngine();

        this.gameState = {
            isStarted: false,
            mapServed : false,
            playersReady : []
        }
    }

    addPlayer(player) {
        if (this.players.length === this.maxPlayers) {
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

    init() {
        this.maze = new Maze(this.width, this.height);

        if (!this.allPlayersJoined) {
            throw new Error("Waiting for players to join");
        }

        this.players.forEach(plyr => this.maze.playerMap.set(plyr, this.maze.getRandomCell()));
    }

    start(){
        this.isStarted = true;
    }
}

module.exports = {
    Game: Game
}