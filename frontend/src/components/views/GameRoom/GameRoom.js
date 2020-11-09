import React from 'react';
import socketIOClient from "socket.io-client";
import GameRoomView from './GameRoomView';
import GamePanel from './../GamePanel/GamePanel'

const ENDPOINT = "http://localhost:3000/game-room";

const GameRoom = (props) => {

    const socketConf = {
        "force new connection": true,
        "reconnectionAttempts": "Infinity",
        "timeout": 10000,
        transports: ['websocket', 'polling', 'flashsocket']
    };

    const [roomState, updateState] = React.useState({ games: [], players: [], gameJoined: false,  playingGameId: null, playerId: null });
    const [socket, updateSocket] = React.useState(null);

    const createGameHandler = (gameConfiguration) => {
        socket.emit('createGame', { width: gameConfiguration.width, height: gameConfiguration.height, maxPlayers: gameConfiguration.maxPlayers });
    }

    const leaveGameHandler = () => {
        socket.emit('disconnect', { playerName: props.playerName });

    }

    const onGameJoinHandler = (gameId) => {
        console.log(`received gameId onGameJoinHandler ${gameId}`);
        updateState(prevState => ({ ...prevState, gamJoined: true, playingGameId: gameId }));
    }

    React.useEffect(() => {
        const socketClient = socketIOClient(ENDPOINT, socketConf);

        updateSocket(socketClient);

        socketClient.emit('newPlayerJoined', props.playerName);

        socketClient.on("roomStateUpdate", data => {
            console.log("running roomStateUpdate", data);
            updateState(prevState => ({...prevState, games: data.games, players: data.players }));
        });

        socketClient.on("playerIdAssigned", data => {

            console.log(`Player id assigned. ${data.playerId}`);
            updateState(prevState => ({ ...prevState, playerId: data.playerId }));
            console.log(roomState);
        });

        socketClient.on("gameJoined", data => {
            console.log(`Game id joined. ${data}`);
            updateState(prevState => ({ ...prevState, gamJoined: true, playingGameId: data.gameId }));
        });

        return () => socketClient.disconnect();
    }, []);

    console.log(`gameJoined: ${roomState.gamJoined} playerId=${roomState.playerId} gameId=${roomState.gameId}` );

    return ( 
        !roomState.gamJoined ?
            <GameRoomView
                onGameJoinHandler={onGameJoinHandler}
                createGameHandler={createGameHandler}
                games={roomState.games}
                players={roomState.players}>
            </GameRoomView>
            : <GamePanel gameId={roomState.playingGameId} playerId={roomState.playerId} socket={socket}></GamePanel>);
}

export default GameRoom;