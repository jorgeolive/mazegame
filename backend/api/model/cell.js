
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
        //this.htmlElement = this.createHtmlElement();
    }

    /*createHtmlElement() {
        let element = document.createElement('div');
        element.classList.add('leftwall');
        element.classList.add('rightwall');
        element.classList.add('bottomwall');
        element.classList.add('topwall');
        element.id = this.id;

        return element;
    }*/

    /*
    removeLeftWall = () => {
        //this.hasLeftWall = false;
        this.htmlElement.classList.remove('leftwall');
    }

    removeRightWall = () => {
        //this.hasRightWall = false;
        this.htmlElement.classList.remove('rightwall');
    }

    removeTopWall = () => {
        //this.hasTopWall = false;
        this.htmlElement.classList.remove('topwall');
    }

    removeBottomWall = () => {
        //this.hasBottomWall = false;
        this.htmlElement.classList.remove('bottomwall');
    }

    markAsVisited = () => {
        this.htmlElement.classList.add('visited');
        //this.visited = true;
    }*/

    

    static getId = (i, j) => "i_" + i + "j_" + j;
}

module.exports = {
    Cell: Cell
}