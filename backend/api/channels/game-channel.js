const { Player } = require('../model/Player');

module.exports.registerSocket = function (io, socket, game) {

    const gameObserver  = {
        next: function(next) {
          io.to(`game${game.id}`).emit(next);
        },
        error: function(error) {
          console.log(error);
        },
        complete: function() {
          console.log("done");
        }
      };

        /*const interval = setInterval(() => {
            console.log('[Game Channel ] connection request');
            if (game.Started) {
               
            }

        }, 3000);*/

        socket.on("disconnect", () => {

            game.started = false;
            clearInterval(interval);

            console.info(`[Game Channel ]player gone [id=${playerId}]`);

            io.to(`game${game.id}`).emit('gameEnded', {});
            io.to(`game${game.id}`).close();

        });

        socket.on('gameDataACK', (payload) => {

          if(gameState.playersReady.filter(x => x == payload.playerId).length == 0)
            gameState.playersReady.push(payload.playerId); 

          if(gameState.playersReady.length === game.players.length){

            game.start();
            gameEngine.playerMovements$.subscribe(gameObserver);

            io.to(`game${game.id}`).emit('startingGame', {mazeData : {players : game.players}});
            gameState.isStarted = true;
          }
        });

        socket.on('playerJoined', (player) => {
          console.log("[Gam Channel ] playerJoined");

            if (game.allPlayersJoined()) {
              socket.emit('error', { error: "Can't join this game, is full." });
            } else {

                const player = new Player(player.playerNumber, player.playerName);               
                socketPool.set(socket, playerNumber);

                game.addPlayer(player);
                socket.emit('playerJoinedSuccess', { playerId: playerNumber, gameId: game.id });

                if (game.allPlayersJoined() && !gameState.mapServed) {

                    game.init();
                    
                    console.log("serving maze!");
                    io.to(`game${game.id}`).emit('gameData',
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

        socket.on('newMovement', ({playerId, cellId}) => {
            if(!gameState.isStarted){
              socket.emit('invalidAction');
            } else {
              game.engine.pushMovement(playerId, cellId);
            }
        }); 
}