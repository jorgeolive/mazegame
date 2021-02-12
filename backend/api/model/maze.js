
const { Cell } = require("../model/cell");

class Maze {

    constructor(width, height) {

        //this.playerMap = new Map();
        //this.monsterMap = new Map();
        this.adjacencyList = new Map();
        this.width = width;
        this.height = height;
        this.cellMap = this.generateCells();
        this.cells = [...this.cellMap].map(x => x[1]).sort((a,b) => {
            if(a.i > b.i) 
               return 1;
            if(a.i < b.i)
               return -1;
            if(a.j > b.j)
               return 1;
            return -1;
          } );
        this.createRandomLabyrinth();
    }

    getNeighbours = (cell) => {
        let neightbours = [];

        if (!this.isFirstLine(cell)) {
            neightbours.push(this.getCellById(cell.i - 1, cell.j));
        }

        if (!this.isLastLine(cell)) {
            neightbours.push(this.getCellById(cell.i + 1, cell.j));
        }

        if (!this.isLeftEdge(cell)) {
            neightbours.push(this.getCellById(cell.i, cell.j - 1));
        }

        if (!this.isRightEdge(cell)) {
            neightbours.push(this.getCellById(cell.i, cell.j + 1));
        }

        return neightbours;
    }

    isFirstLine = (cell) => cell.i == 0;
    isLastLine = (cell) => this.height - 1 == cell.i;
    isLeftEdge = (cell) => cell.j == 0;
    isRightEdge = (cell) => cell.j == this.width - 1;

    generateCells() {
        let cellsMap = new Map();
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                cellsMap.set(Cell.getId(i, j), new Cell(i, j));
            }
        }

        return cellsMap;
    }

    areCellsConnected(first, other) {
        return this.adjacencyList.get(first).some(elem => elem == other);
    }

    getCellById(i, j) {
        return this.cells.find(elem => elem.i == i && elem.j == j);
    }

    getRandomCell = () => this.cells[Math.floor(Math.random() * this.cells.length)];

    createRandomLabyrinth() {
        let visitedCells = new Set();
        let randomCell = this.cells[Math.floor(Math.random() * this.cells.length)];
        let dfsStack = [];
        dfsStack.push(randomCell);

        while (dfsStack.length != 0) {

            let currentElement = dfsStack.pop();

            if (!currentElement.visited) {
                currentElement.visited = true;
            }

            visitedCells.add(currentElement.id);

            let unvisitedNeighbours = this.getUnvisitedNeighbours(currentElement, visitedCells);

            if (unvisitedNeighbours.length != 0) {
                dfsStack.push(currentElement);

                let randomNeighbour = unvisitedNeighbours[Math.floor(Math.random() * unvisitedNeighbours.length)];

                this.updateAdjancecyList(currentElement, randomNeighbour, this.adjacencyList)
                dfsStack.push(randomNeighbour);
            }
        }
    }

    getUnvisitedNeighbours(cell, visitedCells) {
        let result = [];
        this.getNeighbours(cell).forEach(elem => {
            if (!visitedCells.has(elem.id)) {
                result.push(elem);
            }
        });
        return result;
    }

    updateAdjancecyList(node, secondaryNode, adjancecyList) {

        if (!adjancecyList.has(node.id)) {
            adjancecyList.set(node.id, [secondaryNode.id]);
        } else {
            let values = adjancecyList.get(node.id);
            values.push(secondaryNode.id);
            adjancecyList.delete(node.id);
            adjancecyList.set(node.id, values);
        }
    
        if (!adjancecyList.has(secondaryNode.id)) {
            adjancecyList.set(secondaryNode.id, [node.id]);
        } else {
            let values = adjancecyList.get(secondaryNode.id);
            values.push(node.id);
            adjancecyList.delete(secondaryNode.id);
            adjancecyList.set(secondaryNode.id, values);
        }
    
        if (node.j == secondaryNode.j - 1) {
            node.hasRightWall = false;
            secondaryNode.hasLeftWall = false;
        }
    
        if (node.j - 1 == secondaryNode.j) {  
            node.hasLeftWall = false;
            secondaryNode.hasRightWall = false;
        }
    
        if (node.i == secondaryNode.i - 1) {  
            node.hasBottomWall = false;   
            secondaryNode.hasTopWall = false;
        }
    
        if (node.i - 1 == secondaryNode.i) {
    
            node.hasTopWall = false;
            secondaryNode.hasBottomWall = false;
        }
    } 
}

module.exports = {
    Maze: Maze
}