import React from 'react';
import socketIOClient from "socket.io-client";
import GameRoomView from './GameRoomView';

const ENDPOINT = "http://localhost:3000/game-room";

const GameRoom = (props) => {

    const socketConf =  {
        "force new connection" : true,
        "reconnectionAttempts": "Infinity",
        "timeout" : 10000, 
        transports: ['websocket', 'polling', 'flashsocket']};

    const [roomState, updateState] = React.useState({games: [], players: [], socket: null});
    const [socket, updateSocket] = React.useState(null);

    const createGameHandler = (gameConfiguration) => {
        socket.emit('createGame', {width : gameConfiguration.width, height:  gameConfiguration.height, maxPlayers: gameConfiguration.maxPlayers});
    }

    React.useEffect(() => {
         let socketClient = socketIOClient(ENDPOINT, socketConf);

        updateSocket(socketClient);

        socketClient.on("roomStateUpdate", data => {
            debugger;
            console.log("running roomStateUpdate", data);
            updateState(prevState => ({games: data.games, players: data.players}));
        });
        return () => socketClient.disconnect();
    }, []);

    return <GameRoomView 
    createGameHandler={createGameHandler} 
    games={roomState.games} 
    players = {roomState.players}>        
    </GameRoomView>;
}

export default GameRoom;