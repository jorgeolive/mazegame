import React from 'react';
import Maze from './Maze/maze';

const GamePanel = React.memo(({ gameId, playerId, socket }) => {
  console.log(`game id ${gameId}`);
  const [socketState, updateSocket] = React.useState(socket);
  const [gameState, updateGameState] = React.useState({ gotMap: false, gameStarted: false, adjancecyList: [], cells: [], players: [], gameId: gameId, playerId: playerId, width: 20, height: 20, playerMap: null });

  React.useEffect(() => {

    socket.emit('joinGame', { gameId });

    socket.on("gameData", data => {
      updateGameState(prevState => ({ 
        ...prevState, 
        gotMap: true, adjancecyList: data.mazeData.adjancecyList, cells: data.mazeData.cells,
        players: data.mazeData.players, height: data.mazeData.height, width: data.mazeData.width,
        playerMap: new Map(data.mazeData.playerMap) }));
      debugger;
      socket.emit("gameDataACK", { playerId: playerId });
    });

    socket.on("gameStateUpdated",
      data => updateGameState(prevState => ({ ...prevState, players: data.mazeData.players, playerMap : new Map(data.PlayerMap) })));

    socket.on("gameStarted",
      data => updateGameState(prevState => ({ ...prevState, gameStarted: true })));

    return () => socket.disconnect();
  }, []);


  const movementHandler = (newPosition) => {
    if(gameState.gameStarted)
      socketState.emit('newMovement', { playerId: playerId, cellId: newPosition });
  }

  const styles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const flexItemStyle = {
    padding: '20px 20px 20px 20px'
  }

  return (gameState.gotMap && gameState.gameStarted ?
    <div style={styles}>
      <div style={flexItemStyle}>
        <Maze cells={gameState.cells} players={gameState.players} 
              adjancecyList={gameState.adjancecyList} 
              movementHandler={movementHandler} width={gameState.width} height={gameState.height}
              playerMap={gameState.playerMap}></Maze></div>
    </div> :
    <div>Waiting for other players...</div>
  );

});

export default GamePanel;