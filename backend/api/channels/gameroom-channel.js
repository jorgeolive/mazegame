const { Player } = require('../model/Player');
const { Game } = require('../model/game');
let gameChannelSocket = require('./game-channel');
const { GameEngine } = require('../../game-engine');
module.exports.gameRoomChannel =  function (app) {

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

        socket.on('newPlayerJoined', (player) =>{

            socket.join('gamesRoom');

            let playerNumber = Math.floor(Math.random()*10000);

            connectedSockets.set(socket, playerNumber);
            currentPlayers.set(playerNumber, new Player(playerNumber, player));

            socket.emit('playerIdAssigned', {playerId: playerNumber});
            notifyUpdate = true;
        } );

        socket.on("disconnect", () => {

            let playerId = connectedSockets.get(socket);

            currentPlayers.delete(playerId);
            connectedSockets.delete(socket);

            console.info(`[GameRoom Channel ] player gone [id=${playerId}]`);     
            notifyUpdate = true; 
        });

        socket.on("createGame", ({width, height, maxPlayers}) => {
            //TODO message validation

            const gameId = Math.floor(Math.random()*1000);
            const game = new Game(gameId, width, height, maxPlayers);
            currentGames.set(gameId, game);   

            notifyUpdate = true;    
        });

        socket.on("joinGame", (game) => {
            
            let currentGame = currentGames.get(game.id); 
            let player = currentPlayers.keys.filter(x => x.id === connectedSockets.get(socket));
            currentGame.addPlayer(player); // TODO control de errores.-

            gameChannelSocket.registerSocket(socketio, socket, game); // Create game channel
            notifyUpdate = true;    

            console.info(`[GameRoom Channel ] player ${player} joined game ${game.id} `);      
        });
 
        setInterval(() => {

            if (notifyUpdate){               
                socketio.to('gameRoom').emit('roomStateUpdate', {games : Array.from(currentGames.values()), players: Array.from(currentPlayers.values())});
                notifyUpdate = false;
            }
            
           }, 3000);
    });
}

