const Rx = require("rxjs");
const Cell = require("./api/model/cell");

class GameEngine {

    constructor(maze) {
        this.maze = maze;
        this.Events$ = new Rx.Subject();
    }

    buildPathMap = () => {
        
        let run = 0;
        this.maze.cells.forEach(x => {

            let map = new Map();

            this.maze.cells.forEach(y => {
               map.set(y.id, this.getShortestPathToBFS(x, y));
            });

            console.log(`Running foreach in buildmap... run for cell ${run} out of  ${this.maze.width*this.maze.height}`);

            run++;

            this.maze.shortestPathMap.set(x.id, map);
        });
    }
    
    getShortestPathToBFS = (from, to) => {
        var visitedMap = [];
        visitedMap.push(from.id);
        var queue = [];
        var fromMap = new Map();
        let found = false;
        let path = [];
    
        queue.push(from.id);
    
        while (queue.length != 0 && !found) {
            let currentNode = queue.shift();
            let adjacentNodes = this.maze.adjacencyList.get(currentNode);
    
            adjacentNodes.forEach(element => {
                if (!visitedMap.includes(element)) {
                    visitedMap.push(element);
    
                    fromMap.set(element, currentNode);
                    queue.push(element);
                    if (element == to.id) {
                        found = true;
                    }
                }
            });
    
    
            if (found) {
                let previous = fromMap.get(to.id);
    
                while (previous != undefined) {
                    path.push(previous);
                    previous = fromMap.get(previous);
                }
            }
        }
    
        return path.reverse();
    }
}

module.exports = {
    GameEngine: GameEngine
}