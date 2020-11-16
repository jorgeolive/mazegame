import React from 'react';
import Maze from './Maze/maze';

const GamePanel = React.memo(({ gameId, playerId, socket }) => {
  console.log(`game id ${gameId}`);
  const [socketState, updateSocket] = React.useState(socket);
  const [gameState, updateGameState] = React.useState({ gotMap: false, gameStarted: false, adjancecyList: [], cells: [], players: [], gameId: gameId, playerId: playerId, width: 20, height: 20, playerMap: null, monsterMap: null });

  React.useEffect(() => {

    socket.emit('joinGame', { gameId });

    socket.on("gameData", data => {
      updateGameState(prevState => ({ 
        ...prevState, 
        gotMap: true, adjancecyList: data.mazeData.adjancecyList, cells: data.mazeData.cells,
        players: data.mazeData.players, height: data.mazeData.height, width: data.mazeData.width,
        playerMap: new Map(data.mazeData.playerMap),
        monsterMap : new Map(data.mazeData.monsterMap)
       }));
      socket.emit("gameDataACK", { playerId: playerId });
    });

    socket.on("gameStateUpdated",
      data => {
        debugger;
        updateGameState(prevState => ({ ...prevState, playerMap : new Map(data.playerMap), monsterMap : new Map(data.monsterMap) }));
      } );

    socket.on("gameStarted",
      data => {
        updateGameState(prevState => ({ ...prevState, gameStarted: true }));

        document.addEventListener('keydown', e => {
          e.preventDefault();
          const key = e.key;
          switch (key) {
              case "ArrowLeft":
              case "ArrowRight":
              case "ArrowUp":
              case "ArrowDown":
                  socketState.emit('newMovement', { playerId: playerId, direction: key });
                  break;
              default:
                  break;
          }
        });
    });

    return () => {
       socket.disconnect();
       document.removeEventListener('keydown');}
  }, []);

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
              width={gameState.width} height={gameState.height}
              playerMap={gameState.playerMap}
              monsterMap={gameState.monsterMap}></Maze></div>
    </div> :
    <div>Waiting for other players...</div>
  );

});

export default GamePanel;