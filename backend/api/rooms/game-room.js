

module.exports.registerSocket = function (io, socket, game) {

  const Rx = require("rxjs");
  const RxOp = require('rxjs/operators');

  const gameRoomId = `game${game.id}`;
  socket.join(gameRoomId);
  socket.emit('playerJoinedSuccess', { gameId: game.id });

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

      game.gameEvents$.pipe(
        RxOp.filter(x => x.eventType !== 'progressStatus')).subscribe(x =>
         {
            x.eventType === "mapUpdate" ?
              io.to(gameRoomId).emit('gameStateUpdated', x) :
              io.to(gameRoomId).emit('gameEvent', x);
         },
        x_ => console.log(x_),
        () => console.log("completed"));

      game.start();

      io.in(gameRoomId).emit('gameStarted');

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

  if (game.allPlayersJoined && !game.gameState.mapServed) {

    io.to(gameRoomId).emit('allPlayersJoined');
    console.log("initializing maze.");

    game.gameEvents$.pipe(
      RxOp.filter(x => x.eventType === 'progressStatus')).
      subscribe(x => 
      {io.to(gameRoomId).emit('progressStatus', x)});
 
    game.init().then( () => {
 
      console.log("serving maze!");
      io.to(gameRoomId).emit('gameData',
        {
          mazeData: {
            adjancecyList: Object.fromEntries(game.maze.adjacencyList),
            cells: game.maze.cells,
            players: game.players.map( x => x.asSerializable()),
            height: game.height,
            width: game.width,
            playerMap: Array.from(game.engine.playerMap.entries()),
            monsterMap: Array.from(game.engine.monsterMap.entries()),
            goodieMap:  Array.from(game.engine.goodieMap.entries())
          }
        });

    }).
    catch( err => console.log('initialization: ' + err));
  } else {
    socket.emit('waitingForOtherPlayers');
  }
}