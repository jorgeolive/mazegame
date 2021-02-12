const Rx = require("rxjs");
const Cell = require("./cell");
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

class GameEngine {

    constructor() {

        this.playerMap = new Map();
        this.monsterMap = new Map();
        this.shortestPathMap = new Map();
        this.engineEvents$ = new Rx.Subject();
        this.movements$ = new Rx.Subject();
    }

    buildPathMap = (maze) => {

        console.log(`running game-engine.js buildPathMap`);

        return new Promise((resolve, reject) => {

            //if debugging 
            //const worker = new Worker('./backend/api/model/game-engine_worker.js', {
            const worker = new Worker('./api/model/game-engine_worker.js', {
                workerData: {
                    cells: maze.cells,
                    adjacencyList: maze.adjacencyList
                }
            });

            worker.on('message', (x) => {
                console.log(`received pathmap from worker thread.`);
                console.log(typeof x);
                this.shortestPathMap = x;
                resolve();
            });
        }); 
    }

    moveOrAttackClosestPlayer = (players,monster) => {

        const pathMap = new Map();
        let minPath = Number.POSITIVE_INFINITY;
        let nearestPlayer;
        let monsterPlayerCollision = false;

        players.filter(x => x.isAlive).forEach(plyr => {

            const monsterPosition = this.monsterMap.get(monster.id);
            const position = this.playerMap.get(plyr.id);

            monsterPlayerCollision = monsterPosition === position;

            if (!monsterPlayerCollision) {

                const path = this.shortestPathMap.get(position).get(monsterPosition);

                pathMap.set(plyr.id, path);

                if (path.length < minPath) {
                    minPath = path.length;
                    nearestPlayer = plyr;
                }
            } else {
                this.playerMap.delete(plyr.id);
                plyr.kill();
            }
        });

        if (!monsterPlayerCollision) {
            const path = pathMap.get(nearestPlayer.id);

            this.monsterMap.delete(monster.id);
            this.monsterMap.set(monster.id, path[path.length - 1]);
        } else {
            //this.gameOver = true;
        }
    }

    runGameCycle = (players, monsters) => {

        monsters.forEach(monster => {
            this.moveOrAttackClosestPlayer(players, monster )

        });

        this.movements$.next({
            playerMap: Array.from(this.playerMap.entries()),
            monsterMap: Array.from(this.monsterMap.entries())
        });
    }
}

module.exports = {
    GameEngine: GameEngine
}