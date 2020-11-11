const Rx = require("rxjs");

class GameEngine {

    constructor(maze) {

        this.maze = maze;
        this.playerMovements$ = new Rx.Subject();
        //this.monsterMovements$ = new Observable();
    }

    pushMovement = (player, newCellId) => {

        const playerPosition = this.maze.playerMap.get(player);

        if (playerPosition) {
            if (this.maze.areCellsConnected(playerPosition, newCellId)) {
                this.maze.playerMap.delete(player);
                this.maze.playerMap.set(player, newCellId);
                this.playerMovements$.next({ playerMap: this.maze.playerMap });
            }
        }
    }
}

module.exports = {
    GameEngine: GameEngine
}