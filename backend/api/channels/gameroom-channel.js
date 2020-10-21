const { Player } = require('../model/Player');
const { Game } = require('../model/game');

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

        socketPool.set(socket, socketPool.size + 1);
        currentPlayers.set(currentPlayers.size + 1, new Player(currentPlayers.size + 1));

        socket.on("disconnect", () => {

            let playerId = socketPool.get(socket).id;
            currentPlayers.delete(x => x.id === playerId);
            socketPool.delete(socket);

            console.info(`player gone [id=${playerId}]`);     
            notifyUpdate = true; 
        });

        socket.on("createGame", (game) => {
            //TODO message validation
            let gameId = Math.floor(Math.random()*1000);
            currentGames.set(gameId, new Game(gameId, game.width, game.height, game.maxPlayers));   
            notifyUpdate = true;    
        });

        socket.on("joinGame", (game) => {
            let currentGame = currentGames.get(game.id); 
            let player = currentPlayers.filter(x => x.id === socketPool.get(socket));
            currentGame.addPlayer(player); // TODO control de errores.-
            notifyUpdate = true;    

            console.info(`Game has new player...`);      

            gameRoomNamespace.emit("playerJoinedGame", );
        });

        setInterval(() => {

            if (notifyUpdate){
                const currentGames_ = Array.from(currentGames.values());
                const currentPlayers_ = Array.from(currentPlayers.values());
                
                gameRoomNamespace.emit('roomStateUpdate', {games : currentGames_, players: currentPlayers_});
                notifyUpdate = false;
            }
            
           }, 3000);

    });
}

