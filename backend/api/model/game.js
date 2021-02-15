const { GameEngine } = require("./game-engine");
const { Maze } = require("./maze");
const Rx = require("rxjs");
const { Monster } = require("./monster");
const { Cell } = require("./cell");
const { performance } = require('perf_hooks');
const { Goodie } = require("./goodie");

class Game {

    maze;

    constructor(id, width, height, maxPlayers, maxMonsters, totalGoodies) {

        this.goodies = Goodie.goodieGenerator(totalGoodies);
        this.id = id;
        this.width = width;
        this.height = height;
        this.maxPlayers = maxPlayers;
        this.maxMonsters = maxMonsters;
        this.players = [];
        this.monsters = [];
        this.movements$ = new Rx.Subject();
        this.gameEvents$ = new Rx.Subject();

        this.engine = new GameEngine(this.gameEvents$);

        this.gameState = {
            isStarted: false,
            mapServed: false,
            playersReady: []
        }
    }

    stop = () => {

        this.movements$.unsubscribe();
        clearInterval(this.interval);
        this.gameState.isStarted = false;
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

        if (!this.allPlayersJoined) {
            throw new Error("Waiting for players to join");
        }

        this.players.forEach(plyr => {
            const cellId = this.maze.getRandomCell().id;
            this.engine.playerMap.set(plyr.id, cellId);

            plyr.playerEvents$.subscribe(x => {
                this.gameEvents$.next(x);
                if (x.eventType === "playerCaught") {
                    plyr.playerEvents$.unsubscribe();
                    console.log(`player ${plyr.id} is dead. Unsubscribed from it's event stream.`);
                }
            });
        });

        this.pushNewGoodie();

        for (let i = 0; i < this.maxMonsters; i++)
            this.monsters.push(new Monster(Math.floor(Math.random() * 10000)));

        this.monsters.forEach(monster => {
            const cellId = this.maze.getRandomCell().id;
            this.engine.monsterMap.set(monster.id, cellId);
        });

        return this.engine.buildPathMap(this.maze);
    }

    start() {
        if (!this.isStarted) {

            this.gameState.isStarted = true;
            //Move to engine

            this.interval = setInterval(() => {

                //var v1 = performance.now();
                this.engine.runGameCycle(this.players, this.monsters);
                //var v2 = performance.now();
                //console.log("monster IA cyle executed in  " + (v2 - v1) + " milliseconds");

                this.updatePlayers();

            }, 300);
        }
    }

    updatePlayers = () => {

        this.movements$.next({
            playerMap: Array.from(this.engine.playerMap.entries()),
            monsterMap: Array.from(this.engine.monsterMap.entries()),
            goodieMap: Array.from(this.engine.goodieMap.entries())
        });
    }

    pushMovement = (playerId, direction) => {

        //No estoy seguro que objeto deberia gestionar esta logica. Engine?
        const position = this.engine.playerMap.get(playerId);
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

            this.engine.playerMap.delete(playerId);
            this.engine.playerMap.set(playerId, targetCell.id);

            this.checkIfGoodiePick(targetCell, playerId);

            this.updatePlayers();
        }
    }

    checkIfGoodiePick(targetCell, playerId) {
        const goodie = Array.from(this.engine.goodieMap.entries()).filter(x => x[0] == targetCell.id);

        if (goodie[0] != undefined) {
            console.log("goodie", goodie[0]);
            this.engine.goodieMap.delete(targetCell.id);
            this.players.filter(x => x.id == playerId)[0].captureGoodie(goodie[0][1].points);

            this.pushNewGoodie();
        }
    }

    pushNewGoodie() {
        if(this.goodies.length != 0){
            const cellId = this.maze.getRandomCell().id;
            this.engine.goodieMap.set(cellId, this.goodies.shift());
        }
    }
}

module.exports = {
    Game: Game
}