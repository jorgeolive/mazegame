const Rx = require("rxjs");
const {Cell} = require("./cell");
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

class GameEngine {

    constructor(gameEventsObservable) {

        this.playerMap = new Map();
        this.monsterMap = new Map();
        this.shortestPathMap = new Map();
        this.goodieMap = new Map();
        this.gameEventsObservable$ = gameEventsObservable;
    }

    buildPathMap = (maze) => {

        console.log(`running game-engine.js buildPathMap`);

        return new Promise((resolve, reject) => {

            const worker = new Worker('./api/model/game-engine_worker.js', {
                workerData: {
                    cells: maze.cells,
                    adjacencyList: maze.adjacencyList
                }
            });

            worker.on('message', (x) => {

                if (x.eventType === "progressStatus") {
                    this.gameEventsObservable$.next(x);

                } else {
                    console.log(`received pathmap from worker thread.`);
                    console.log(typeof x);
                    this.shortestPathMap = x;
                    resolve();
                }
            });

            worker.on('error', (x) => {
                reject(x);
            });
        });
    }

    placeMonster(monsterId, cellId) {
        this.monsterMap.set(monsterId, cellId);
    }

    pushPlayerMovement(player, direction, maze) {
        const playerId = player.id;
        const position = this.playerMap.get(playerId);
        const currentCell = maze.cellMap.get(position);
        let targetCell;

        switch (direction) {
            case "ArrowLeft":
                targetCell = maze.cellMap.get(Cell.getId(currentCell.i, currentCell.j - 1));
                break;
            case "ArrowRight":
                targetCell = maze.cellMap.get(Cell.getId(currentCell.i, currentCell.j + 1));
                break;
            case "ArrowUp":
                targetCell = maze.cellMap.get(Cell.getId(currentCell.i - 1, currentCell.j));
                break;
            case "ArrowDown":
                targetCell = maze.cellMap.get(Cell.getId(currentCell.i + 1, currentCell.j));
                break;
        }

        if (position && targetCell && maze.areCellsConnected(position, targetCell.id)) {

            this.playerMap.delete(playerId);
            this.playerMap.set(playerId, targetCell.id);

            this.checkIfGoodiePick(targetCell, player);

            this.pushNewMapUpdate();
        }
    }

    
    moveOrAttackClosestPlayer = (players, monster) => {

        const pathMap = new Map();
        let minPath = Number.POSITIVE_INFINITY;
        let nearestPlayer;
        let anyPlayerCaught = false;

        players.filter(x => x.isAlive).forEach(plyr => {
            if (!anyPlayerCaught) {

                const monsterPosition = this.monsterMap.get(monster.id);
                const position = this.playerMap.get(plyr.id);

                if (monsterPosition !== position) {

                    const path = this.shortestPathMap.get(position).get(monsterPosition);
                    pathMap.set(plyr.id, path);

                    if (path.length < minPath) {                        
                        minPath = path.length;
                        nearestPlayer = plyr;
                    }
                } else {
                    this.playerMap.delete(plyr.id);
                    plyr.kill();
                    anyPlayerCaught = true;
                }
            }
        });

        if (!anyPlayerCaught) {
            this.moveMonsterToClosestPlayer(pathMap, nearestPlayer, monster);
            this.pushNewMapUpdate();
        } else {
            if(players.every(x => !x.isAlive)){ 
                this.gameEventsObservable$.next({eventType: "allPlayersDead"});
            } else {
                this.pushNewMapUpdate();
            }
        }
    }

    moveMonsterToClosestPlayer(pathMap, nearestPlayer, monster) {
        const path = pathMap.get(nearestPlayer.id);
        this.monsterMap.delete(monster.id);
        this.monsterMap.set(monster.id, path[path.length - 1]);
    }

    pushNewMapUpdate() {
        this.gameEventsObservable$.next({
            eventType: "mapUpdate",
            playerMap: Array.from(this.playerMap.entries()),
            monsterMap: Array.from(this.monsterMap.entries()),
            goodieMap: Array.from(this.goodieMap.entries())
        });
    }


    checkIfGoodiePick(targetCell, player) {

        const goodie = Array.from(this.goodieMap.entries()).filter(x => x[0] == targetCell.id);

        if (goodie[0] != undefined) {
            this.goodieMap.delete(targetCell.id);
            player.captureGoodie(goodie[0][1].points);

            this.gameEventsObservable$.next({eventType: "goodieCaptured"});
        }
    }

    runGameCycle = (players, monsters) => {

        monsters.forEach(monster => {
            this.moveOrAttackClosestPlayer(players, monster)
        });
    }
}

module.exports = {
    GameEngine: GameEngine
}