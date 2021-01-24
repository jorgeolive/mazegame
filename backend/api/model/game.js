const { GameEngine } = require("../../game-engine");
const { Maze } = require("./maze");
const Rx = require("rxjs");
const { Monster } = require("./monster");
const { Cell } = require("./cell");
const { performance } = require('perf_hooks');

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
        this.gameEvents$ = new Rx.Subject();

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

        for (let i = 0; i < this.maxMonsters; i++)
            this.monsters.push(new Monster(Math.floor(Math.random() * 10000)));

        this.monsters.forEach(monster => {
            const cellId = this.maze.getRandomCell().id;
            this.maze.monsterMap.set(monster.id, cellId);
        });
    }

    moveMonsters = () => {

        const pathMap = new Map();
        let minPath = Number.POSITIVE_INFINITY;
        let nearestPlayer;
        let monsterPlayerCollision = false;

        this.monsters.forEach(monster => {

            this.players.forEach(plyr => {

                const monsterPosition = this.maze.monsterMap.get(monster.id);
                const position = this.maze.playerMap.get(plyr.id);

                monsterPlayerCollision = monsterPosition === position;

                if (!monsterPlayerCollision) {
                    const path = this.engine.getShortestPathToBFS(position, monsterPosition);

                    pathMap.set(plyr.id, path);

                    if (path.length < minPath) {
                        minPath = path.length;
                        nearestPlayer = plyr;
                    }
                } else {
                    this.maze.playerMap.delete(plyr.id);
                    this.players = this.players.filter( x => x !== plyr);
                    this.gameEvents$.next({eventType: "playerCaught", playerId : plyr.id});  
                }
            });

            if (!monsterPlayerCollision) {
                const path = pathMap.get(nearestPlayer.id);

                this.maze.monsterMap.delete(monster.id);
                this.maze.monsterMap.set(monster.id, path[path.length - 1]);

               
            } else {
                this.gameOver = true;
            }
        });

        this.movements$.next({
            playerMap: Array.from(this.maze.playerMap.entries()),
            monsterMap: Array.from(this.maze.monsterMap.entries())
        });
    }

    start() {
        if (!this.isStarted) {

            this.gameState.isStarted = true;
            this.interval = setInterval(() => {

                var v1 = performance.now();
                this.moveMonsters();
                var v2 = performance.now();
                console.log("monster IA cyle executed in  " + (v2 - v1) + " milliseconds");

            }, 300);
        }
    }

    pushMovement = (playerId, direction) => {

        const position = this.maze.playerMap.get(playerId);
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

            this.maze.playerMap.delete(playerId);
            this.maze.playerMap.set(playerId, targetCell.id);

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