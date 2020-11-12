const Rx = require("rxjs");
const Cell = require("./api/model/cell");

class GameEngine {

    constructor(maze) {
        this.maze = maze;
        this.playerMovements$ = new Rx.Subject();
        //this.monsterMovements$ = new Observable();
    }

    pushMovement = (player, direction) => {

        const position = this.maze.playerMap.get(player);
        const currentCell = this.maze.cellMap.get(position);
        let targetCell;

        switch (direction) {
            case "ArrowLeft":
                targetCell = this.maze.cellMap.get(Cell.Cell.getId(currentCell.i, currentCell.j - 1));
                break;
            case "ArrowRight":
                targetCell = this.maze.cellMap.get(Cell.Cell.getId(currentCell.i, currentCell.j + 1));
                break;
            case "ArrowUp":
                targetCell = this.maze.cellMap.get(Cell.Cell.getId(currentCell.i - 1, currentCell.j));
                break;
            case "ArrowDown":
                targetCell = this.maze.cellMap.get(Cell.Cell.getId(currentCell.i + 1, currentCell.j));
                break;
        }

        if (position && targetCell && this.maze.areCellsConnected(position, targetCell.id)) {

            this.maze.playerMap.delete(player);
            this.maze.playerMap.set(player, targetCell.id);
            this.playerMovements$.next({ playerMap: Array.from(this.maze.playerMap.entries()) });
        }
    }
}

module.exports = {
    GameEngine: GameEngine
}