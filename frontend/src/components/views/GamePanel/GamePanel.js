import React from 'react';
import socketIOClient from "socket.io-client";
import Maze from './Maze/maze';

const GamePanel = React.memo(({gameId, playerId, socket}) => {
    console.log(`game id ${gameId}`);
    const [socketState, updateSocket] = React.useState(socket);
    const [gameState, updateGameState] = React.useState({gotMap: false, gameStarted: false, adjancecyList: [], cells: [], players: [], gameId: gameId, playerId: playerId});

    React.useEffect(() => {

        socket.connect(`http://localhost:3000/gameid/${gameId}`);
        console.log(`http://localhost:3000/gameid/${gameId}`);
        socket.emit('playerJoined', {playerId});

        socket.on("gameData", data => {
            console.log("obtained game metadata from server.", data);
            updateGameState(prevState => ({ ...prevState, gotMap: true, adjancecyList: data.mazeData.adjancecyList, cells: data.mazeData.cells, players: data.mazeData.players}));
        });

        socket.on("gameStateUpdated",
         data => updateGameState(prevState => ({ ...prevState, players: data.mazeData.players})));

        
        return () => socket.disconnect();
    }, []);


    const movementHandler = (newPosition) => {
        socketState.emit('newMovement', {playerId: playerId, cellId: newPosition});
    }

    const styles = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    
      const flexItemStyle = {
        padding: '20px 20px 20px 20px'
      }

    return ( gameState.gotMap && gameState.gameStarted ? 
        <div style={styles}>
          <div style={flexItemStyle}>
            <Maze cells={gameState.cells} players = {gameState.players} adjancecyList = {gameState.adjancecyList} movementHandler={movementHandler} width={20} height={20}></Maze></div>
        </div> : 
        <div>Waiting for other players...</div> 
    );

});

export default GamePanel;