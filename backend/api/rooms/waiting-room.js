const { Player } = require('../model/Player');
const { Game } = require('../model/game');
let gameChannelSocket = require('./game-room');

module.exports.gameRoomChannel = function (app) {
    const gameRoomChannelSocketRoomId = 'gamesRoom';
    const socketio = require('socket.io')(app, {
        handlePreflightRequest: (req, res) => {
            const headers = {
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Origin": req.headers.origin,
                "Access-Control-Allow-Credentials": true
            };
            res.writeHead(200, headers);
            res.end();
        }
    });

    const connectedSockets = new Map();
    const currentPlayers = new Map();
    const currentGames = new Map();
    let notifyUpdate = false;

    socketio.on('connection', function (socket) {

        console.info(`[GameRoom Channel ] Client connected [id=${socket.id}]`);

        socket.on('newPlayerJoined', (player) => {

            let playerNumber = Math.floor(Math.random() * 10000);
            socket.join(gameRoomChannelSocketRoomId);

            connectedSockets.set(socket, playerNumber);
            currentPlayers.set(playerNumber, new Player(playerNumber, player));

            socket.emit('playerIdAssigned', { playerId: playerNumber });
            notifyUpdate = true;
        });

        socket.on("disconnect", () => {

            let playerId = connectedSockets.get(socket);

            currentPlayers.delete(playerId);
            connectedSockets.delete(socket);

            console.info(`[GameRoom Channel ] player gone [id=${playerId}]`);
            notifyUpdate = true;
        });

        socket.on("createGame", ({ width, height, maxPlayers }) => {
            //TODO message validation

            const gameId = Math.floor(Math.random() * 1000);
            const game = new Game(gameId, width, height, maxPlayers);
            currentGames.set(gameId, game);

            notifyUpdate = true;
        });

        socket.on("joinGame", ({gameId}) => {

            let currentGame = currentGames.get(gameId);

            if (!currentGame.allPlayersJoined) {

                let player = currentPlayers.get(connectedSockets.get(socket));
                currentGame.addPlayer(player); // TODO control de errores.-

                gameChannelSocket.registerSocket(socketio, socket, currentGame);
                console.info(`[GameRoom Channel ] player ${player} joined game ${gameId} `);

                notifyUpdate = true;

            } else {

            }
        });

        setInterval(() => {

            if (notifyUpdate) {
                const anyGame = currentGames.size > 0;
                socketio.to(gameRoomChannelSocketRoomId).emit('roomStateUpdate', { 
                    games: currentGames.size > 0 ? 
                    Array.from(currentGames.values()).map(x => {return {id: x.id, width: x.width, height: x.height, isStarted: x.isStarted, numberOfPlayers : x.players.length}}) :
                    []
                    , players: Array.from(currentPlayers.values())});
                notifyUpdate = false;
            }

        }, 3000);
    });
}

