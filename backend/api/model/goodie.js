class Goodie {
    constructor(type, points) {
        this.type = type;
        this.points = points;
    }

    static goodieGenerator = (numberOfGoodies) => {
        const goodies = [];

        for (let i = 0; i < numberOfGoodies; i++) {

            let goodieCode = (Math.random() * 10).toFixed();
            switch (goodieCode) {
                case "0":
                case "1":
                case "2":
                case "3":
                    goodies.push(new Goodie("hamburguer", 50));
                    break;
                case "4":
                case "5":
                case "6":
                    goodies.push(new Goodie("donut", 100));
                    break;
                case "7":
                case "8":
                    goodies.push(new Goodie("coke", 200));
                case "9":
                case"10":
                    goodies.push(new Goodie("iceCream", 500));
                default:
                    break;
            }
        }

            return goodies;
    }
}

module.exports = {
    Goodie: Goodie
}