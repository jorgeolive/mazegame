const { GameEngine } = require("../../game-engine");
const { Maze } = require("./maze");
const Rx = require("rxjs");
const { Monster } = require("./monster");
const { Cell } = require("./cell");

class Game {

    constructor(id, width, height, maxPlayers, maxMonsters) {

        this.id = id;
        this.width = width;
        this.height = height;
        this.maxPlayers = maxPlayers;
        this.maxMonsters = maxMonsters;
        this.players = [];
        this.monsters = [];
        this.isStarted = false;

        this.movements$ = new Rx.Subject();

        this.gameState = {
            isStarted: false,
            mapServed: false,
            playersReady: []
        }
    }

    stop = () => {

        this.movements$.unsubscribe();
        clearInterval(this.interval);
        this.isStarted = false;
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

    getPlayer(playerId) {
        return this.players.find(elem => elem.id = playerId)[0];
    }

    init() {

        this.maze = new Maze(this.width, this.height);
        this.engine = new GameEngine(this.maze);

        if (!this.allPlayersJoined) {
            throw new Error("Waiting for players to join");
        }

        this.players.forEach(plyr => {
            const cellId = this.maze.getRandomCell().id;
            this.maze.playerMap.set(plyr.id, cellId);
        });

        this.monsters = [new Monster(Math.floor(Math.random() * 10000)), new Monster(Math.floor(Math.random()))];

        this.monsters.forEach(monster => {
            const cellId = this.maze.getRandomCell().id;
            this.maze.monsterMap.set(monster.id, cellId);
        });
    }

    start() {
        this.isStarted = true;
        this.interval = setInterval(() => {

            const pathMap = new Map();
            let minPath = 999999999;
            let nearestPlayer;
//ESTO ESTA MAL REVISAR
            this.monsters.forEach(monster =>
                this.players.forEach(plyr => {

                    const monsterPosition = this.maze.monsterMap.get(monster.id);
                    const position = this.maze.playerMap.get(plyr.id);

                    if (monsterPosition !== position) {
                        const path = this.engine.getShortestPathToBFS(position, monsterPosition);

                        pathMap.set(plyr.id, path);

                        if (path.length < minPath) {
                            minPath = path.length;
                            nearestPlayer = plyr;
                        }

                        this.maze.monsterMap.delete(monster.id);
                        this.maze.monsterMap.set(monster.id, pathMap.get(nearestPlayer.id)[0]);
    
                        this.movements$.next({
                            playerMap: Array.from(this.maze.playerMap.entries()),
                            monsterMap: Array.from(this.maze.monsterMap.entries())
                        });
                    }         
                }));
        }
            , 5000);
    }

    pushMovement = (player, direction) => {

        const position = this.maze.playerMap.get(player);
        const currentCell = this.maze.cellMap.get(position);
        let targetCell;

        switch (direction) {
            case "ArrowLeft":
                targetCell = this.maze.cellMap.get(Cell.getId(currentCell.i, currentCell.j - 1));
                break;
            case "ArrowRight":
                targetCell = this.maze.cellMap.get(Cell.getId(currentCell.i, currentCell.j + 1));
                break;
            case "ArrowUp":
                targetCell = this.maze.cellMap.get(Cell.getId(currentCell.i - 1, currentCell.j));
                break;
            case "ArrowDown":
                targetCell = this.maze.cellMap.get(Cell.getId(currentCell.i + 1, currentCell.j));
                break;
        }

        if (position && targetCell && this.maze.areCellsConnected(position, targetCell.id)) {

            this.maze.playerMap.delete(player);
            this.maze.playerMap.set(player, targetCell.id);

            this.movements$.next({
                playerMap: Array.from(this.maze.playerMap.entries()),
                monsterMap: Array.from(this.maze.monsterMap.entries())
            });
        }
    }
}

module.exports = {
    Game: Game
}