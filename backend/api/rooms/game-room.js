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
          players: game.players,
          height: game.height,
          width: game.width,
          playerMap: Array.from(game.maze.playerMap.entries()),
          monsterMap: Array.from(game.maze.monsterMap.entries())
        }
      });
      console.log("finished serving maze.");

  } else {
    socket.emit('waitingForOtherPlayers');
  }

  socket.on("disconnect", () => {

    game.stop();
    io.to(gameRoomId).emit('gameEnded', {});
    socket.leave(gameRoomId);
  });

  socket.on('gameDataACK', (payload) => {

    console.log('running game data ack.');

    if (game.gameState.playersReady.filter(x => x == payload.playerId).length == 0)
      game.gameState.playersReady.push(payload.playerId);

    if (game.gameState.playersReady.length === game.players.length) {

      console.log("all players joined and ack'ed their data. starting game...");

      game.start();

      game.movements$.subscribe(x => {
        io.to(gameRoomId).emit('gameStateUpdated', x);
      }, x_ => console.log(x_), () => console.log("completed"));

      io.in(gameRoomId).emit('gameStarted');

      game.gameState.isStarted = true;

    } else {
      console.log('not all players have submitted their ACK signal. Waiting..');
    }
  });

  socket.on('newMovement', ({ playerId, direction }) => {
    console.log("logged new movement event");
    if (!game.gameState.isStarted) {
      socket.emit('invalidAction');
    } else {    
      game.pushMovement(playerId, direction);
    }
  });
}