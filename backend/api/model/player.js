class Player {
    constructor(id, name) {
        this.name = name;
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
