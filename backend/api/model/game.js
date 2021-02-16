const { GameEngine } = require("./game-engine");
const { Maze } = require("./maze");
const Rx = require("rxjs");
const RxOp = require('rxjs/operators');
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

        //Smell
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
        return this.players.find(elem => elem.id = playerId);
    }

    init() {
        this.maze = new Maze(this.width, this.height);

        if (!this.allPlayersJoined) {
            throw new Error("Waiting for players to join");
        }

        this.gameEvents$.pipe(
            RxOp.filter(x => x.eventType === "gameOver")).subscribe(x => this.stop());

        this.gameEvents$.pipe(
            RxOp.filter(x => x.eventType === "goodieCaptured")).subscribe(x => this.pushNewGoodie());

        this.createAndPlaceMonsters();
        this.pushNewGoodie();
        this.subscribeToPlayerEvents();

        return this.engine.buildPathMap(this.maze);
    }

    createAndPlaceMonsters() {
        for (let i = 0; i < this.maxMonsters; i++)
            this.monsters.push(new Monster(Math.floor(Math.random() * 10000)));

        this.monsters.forEach(monster => {
            const randomCellId = this.maze.getRandomCell().id;
            this.engine.placeMonster(monster.id,randomCellId);
        });
    }
  
    subscribeToPlayerEvents() {
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
            }, 300);
        }
    }

    pushMovement = (playerId, direction) => {

        if (this.gameState.isStarted) {
            this.engine.pushPlayerMovement(
                this.getPlayer(playerId),
                 direction, 
                 this.maze);
        }
    }

    pushNewGoodie() {
        if (this.goodies.length != 0) {
            const cellId = this.maze.getRandomCell().id;
            this.engine.goodieMap.set(cellId, this.goodies.shift());
        }
    }   
}

module.exports = {
    Game: Game
}