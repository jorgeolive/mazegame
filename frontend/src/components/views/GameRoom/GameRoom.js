import React from 'react';
import GameRoomView from './gameRoomView';
import GamePanel from '../GamePanel/gamePanel'
import {SocketContext} from "../../../context/socket";

const ENDPOINT = "http://localhost:3000";

const GameRoom = (props) => {

    //https://dev.to/bravemaster619/how-to-use-socket-io-client-correctly-in-react-app-o65
    const socketClient = React.useContext(SocketContext);

    const [roomState, updateState] = React.useState({ games: [], players: [], gameJoined: false,  playingGameId: null, playerId: null });
    const [socket, updateSocket] = React.useState(null);

    const createGameHandler = (gameConfiguration) => {
        socket.emit('createGame', { width: gameConfiguration.width, height: gameConfiguration.height, maxPlayers: gameConfiguration.maxPlayers });
    }

    //Mover a use callback??? No estoy seguro, revisar esto https://dmitripavlutin.com/dont-overuse-react-usecallback/
    const leaveGameHandler = React.useCallback(() => {
        socket.emit('disconnect', { playerName: props.playerName });

    });

    const onGameJoinHandler = React.useCallback((gameId) => {
        updateState(prevState => ({ ...prevState, gamJoined: true, playingGameId: gameId }));
    });

    const socketInitialization = () => {

        socketClient.on("roomStateUpdate", data => {
            updateState(prevState => ({...prevState, games: data.games, players: data.players }));
        });

        socketClient.on("playerIdAssigned", data => {

            updateState(prevState => ({ ...prevState, playerId: data.playerId }));
        });

        socketClient.on("gameJoined", data => {
            updateState(prevState => ({ ...prevState, gamJoined: true, playingGameId: data.gameId }));
        });

        //Once the socket is configured store it?
        updateSocket(socketClient);
    };

    React.useEffect(() => {

        socketInitialization();    
        socketClient.emit('newPlayerJoined', props.playerName);

        return () => socketClient.disconnect();
    }, []);

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