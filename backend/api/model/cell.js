
class Cell {
    hasTopWall = true;
    hasBottomWall = true;
    hasLeftWall = true;
    hasRightWall = true;
    visited = false;

    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.id = Cell.getId(i,j);
    }

    static getId = (i, j) => "i_" + i + "j_" + j;
}

module.exports = {
    Cell: Cell
}