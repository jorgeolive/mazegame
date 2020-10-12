class ActiveGames {
    constructor() {
        if (!ActiveGames.instance) {
            ActiveGames.instance = new Map();
        }
    }

    getInstance() {
        return ActiveGames.instance;
    }

    addGame(game) {
        ActiveGames.instance.set(game.id, game);
    }

    getGame(id) {
        return ActiveGames.instance.get(id);
    }
}

module.exports = {
    ActiveGames: ActiveGames
}
