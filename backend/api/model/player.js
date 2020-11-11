class Player {
    constructor(id, name) {
        this.name = name;
        this.id = id;
        this.colorCode = this.getRandomColor();
        //this.hasJoined = false;
    }

    getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

}

module.exports = {
    Player: Player
}
