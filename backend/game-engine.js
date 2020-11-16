const Rx = require("rxjs");
const Cell = require("./api/model/cell");

class GameEngine {

    constructor(maze) {
        this.maze = maze;
    }

    buildPathMap = () => {
     //To consider if it's worth it to run it before game starts.
    }
    
    getShortestPathToBFS = (from, to) => {
        var visitedMap = [];
        visitedMap.push(from);
        var queue = [];
        var fromMap = new Map();
        let found = false;
        let path = [];
    
        queue.push(from);
    
        while (queue.length != 0 && !found) {
            let currentNode = queue.shift();
            let adjacentNodes = this.maze.adjacencyList.get(currentNode);
    
            adjacentNodes.forEach(element => {
                if (!visitedMap.includes(element)) {
                    visitedMap.push(element);
    
                    fromMap.set(element, currentNode);
                    queue.push(element);
                    if (element == to) {
                        found = true;
                    }
                }
            });
    
    
            if (found) {
                let previous = fromMap.get(to);
    
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