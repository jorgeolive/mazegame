const { Player } = require('../model/Player');
const { Game } = require('../model/game');

module.exports.gameChannel = function (app, game) {

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

    const socketPool = new Map();
    
    const gameState = {
        isStarted: false,
        mapServed : false,
        allPlayersJoined : false,
        playersReady : []
    }

    const gameSpace = socketio.of(`/gameid/${game.id}`);

    gameSpace.on('connection', function (socket) {

        const interval = setInterval(() => {

            if (game.Started) {
               
            }

        }, 3000);

        socket.on("disconnect", () => {

            game.started = false;
            clearInterval(interval);

            console.info(`player gone [id=${playerId}]`);

            gameSpace.emit('gameEnded', {});
            gameSpace.close();

        });

        socket.on('gameDataACK', (payload) => {

          if(gameState.playersReady.filter(x => x == payload.playerId).length == 0)
            gameState.playersReady.push(payload.playerId); 

          if(gameState.playersReady.length === game.players.length){
            gameState.isStarted = true;
            game.start();

            gameSpace.emit('startingGame', {mazeData : {players : game.players}});
          }

        });

        socket.on('playerJoined', (player) => {
            if (game.allPlayersJoined()) {
                emit('error', { error: "Can't join this game, is full." });
            } else {

                const player = new Player(player.playerNumber, player.playerName);               
                socketPool.set(socket, playerNumber);

                game.addPlayer(player);
                socket.emit('playerJoinedSuccess', { playerId: playerNumber, gameId: game.id });

                if (game.allPlayersJoined() && !gameState.mapServed) {

                    game.init();
                    
                    console.log("serving maze!");
                    socket.emit('gameData',
                        {
                            mazeData: {
                                adjancecyList: Object.fromEntries(game.maze.adjacencyList),
                                cells: game.maze.cells,
                                players: game.players
                            }
                        });

                } else {
                    socket.emit('waitingForOtherPlayers');
                }
            }
        });
    });
}