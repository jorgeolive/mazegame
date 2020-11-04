const { Player } = require('../model/Player');
const { Game } = require('../model/game');
let createGameChannel = require('./api/channels/game-channel');

module.exports.gameRoomChannel =  function (app) {

    const socketio = require('socket.io')(app, {
        handlePreflightRequest: (req, res) => {
            const headers = {
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
                "Access-Control-Allow-Credentials": true
            };
            res.writeHead(200, headers);
            res.end();
        }
    });
  
    const gameRoomNamespace = socketio.of('/game-room');
    const socketPool = new Map();
    const currentPlayers = new Map();
    const currentGames = new Map();
    const currentMazes = new Map();
    let notifyUpdate = false;

    gameRoomNamespace.on('connection', function (socket) {
        notifyUpdate = true; 

        console.info(`Client connected [id=${socket.id}]`);

        socket.on('newPlayerJoined', (player) =>{

            let playerNumber = Math.floor(Math.random()*10000);

            socketPool.set(socket, playerNumber);
            currentPlayers.set(playerNumber, new Player(playerNumber, player));

            socket.emit('playerIdAssigned', {playerId: playerNumber});
        } );

        socket.on("disconnect", () => {

            let playerId = socketPool.get(socket);
            currentPlayers.delete(playerId);
            socketPool.delete(socket);

            console.info(`player gone [id=${playerId}]`);     
            notifyUpdate = true; 
        });

        socket.on("createGame", (game) => {
            //TODO message validation

            let gameId = Math.floor(Math.random()*1000);
            let game = new Game(gameId, game.width, game.height, game.maxPlayers);

            currentGames.set(gameId, game);   
            createGameChannel(app, game); // Create game channel
            notifyUpdate = true;    
        });

        socket.on("joinGame", (game) => {
            //Esta parte creo que sobra.
            let currentGame = currentGames.get(game.id); 
            let player = currentPlayers.filter(x => x.id === socketPool.get(socket));
            currentGame.addPlayer(player); // TODO control de errores.-
            notifyUpdate = true;    

            console.info(`player ${player} joined game ${game.id} `);      

            gameRoomNamespace.emit("playerJoinedGame", {});
        });

        setInterval(() => {

            if (notifyUpdate){               
                gameRoomNamespace.emit('roomStateUpdate', {games : Array.from(currentGames.values()), players: Array.from(currentPlayers.values())});
                notifyUpdate = false;
            }
            
           }, 3000);

    });
}

