import React from 'react';

const GamePanel = React.memo(({gameId, playerId}) => {
 
    const socketConf = {
        "force new connection": true,
        "reconnectionAttempts": "Infinity",
        "timeout": 10000,
        transports: ['websocket', 'polling', 'flashsocket']
    };

    const [socket, updateSocket] = React.useState(null);
    const [gameState, updateGameState] = React.useState({gotMap: false, gameStarted: false, adjancecyList: [], cells: [], players: []});

    React.useEffect(() => {

        const socketClient = socketIOClient(`http://localhost:3000/${gameId}`, socketConf);
        updateSocket(socketClient);

        socket.emit('playerJoined', {playerId});

        socketClient.on("gameData", data => {
            console.log("obtained game metadata from server.", data);
            updateGameState(prevState => ({ ...prevState, gotMap: true, adjancecyList: data.mazeData.adjancecyList, cells: data.mazeData.cells, players: data.mazeData.players}));
        });

        socketClient.on("gameStateUpdated",
         data => updateGameState(prevState => ({ ...prevState, players: data.mazeData.players})));

        
        return () => socketClient.disconnect();
    }, []);


    const movementHandler = (newPosition) => {
        socket.emit('playerMoved', {playerId});
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
            <Maze cells={state.cells} players = {state.players} adjancecyList = {state.adjancecyList} movementHandler={movementHandler} width={20} height={20}></Maze></div>
        </div> : 
        <div>Waiting for other players...</div> 
    );

});

export default GamePanel;