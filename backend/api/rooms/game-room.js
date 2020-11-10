const { Player } = require('../model/Player');

module.exports.registerSocket = function (io, socket, game) {

  const gameRoomId = `game${game.id}`;

  
  /*const interval = setInterval(() => {
      console.log('[Game Channel ] connection request');
      if (game.Started) {
         
      }

  }, 3000);*/

  socket.join(gameRoomId);
  socket.emit('playerJoinedSuccess', { gameId: game.id });

  if (game.allPlayersJoined && !game.gameState.mapServed) {

    game.init();

    console.log("serving maze!");
    io.to(gameRoomId).emit('gameData',
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


  socket.on("disconnect", () => {

    game.started = false;
    //clearInterval(interval);

    console.info(`[Game Channel ]player gone`);

    io.to(gameRoomId).emit('gameEnded', {});
    io.leave(gameRoomId);
  });

  socket.on('gameDataACK', (payload) => {

    if (game.gameState.playersReady.filter(x => x == payload.playerId).length == 0)
      game.gameState.playersReady.push(payload.playerId);

    if (game.gameState.playersReady.length === game.players.length) {

      game.start();

      const gameObserver = {
        next: function (next) {
          console.log('Running next function');
          io.to(gameRoomId).emit(next);
        },
        error: function (error) {
          console.log(error);
        },
        complete: function () {
          console.log("done");
        }
      };
    
      game.engine.playerMovements$.subscribe(gameObserver);

      io.in(gameRoomId).emit('gameStarted', { });
      game.gameState.isStarted = true;
    }
  });

  //TODO: No existe evento playerJoined, hay que sacar esto fuera del socket.on()
  socket.on('playerJoined', (player) => {
    console.log("[Gam Channel ] playerJoined");
  });

  socket.on('newMovement', ({ playerId, cellId }) => {
    if (!gameState.isStarted) {
      socket.emit('invalidAction');
    } else {
      game.engine.pushMovement(playerId, cellId);
    }
  });

}