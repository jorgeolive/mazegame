class PlayerModel{

    constructor(id, position){
        this.id = id;
        this.position = position;
        this.colorCode = this.getRandomColor();
    }

     getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
}

export default PlayerModel;