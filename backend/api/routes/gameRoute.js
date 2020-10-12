const { ActiveGames } = require("../model/activeGames");
let games = new ActiveGames();

module.exports = function (app, io) {
    var gamesController = require('../controller/gameController');

    app.route('/game')
        .post(gamesController.create_game);

    io.sockets.on('connection', function (socket) {

        socket.on('startGame', function (payload) {
            socket.join(payload.gameId);
            let game = games.getGame(payload.gameId);

            if (game.allPlayersJoined) {
                game.start();

            }
        });

        socket.on('joinGame', function (payload) {
            socket.join(payload.gameId);
            let game = games.getGame(payload.gameId);

            if (game.allPlayersJoined) {
                game.start();
                socket.to(payload.gameId).emit('gameStarted',
                    { players: game.players.map(player => { return { position: player.position, playerId: player.id } }) });
            }
        });


        socket.on('move', function (payload) {

            let game = games.getGame(payload.gameId);
            let player = game.getPlayer(payload.playerId);
            player.setPosition(payload.position);

            socket.to(payload.gameId).emit('playerMoved',
                { players: game.players.map(player => { return { position: player.position, playerId: player.id } }) });
        });
    });
}

