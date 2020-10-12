class Player {
    constructor(id) {
        this.id;
        this.hasJoined = false;
    }

    setPosition(cell) {
        this.cell = cell;
    }

    getPosition = () => this.cell;
}

module.exports = {
    Player: Player
}
