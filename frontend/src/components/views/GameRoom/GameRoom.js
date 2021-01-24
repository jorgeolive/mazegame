import React from 'react';
import GameRoomView from './gameRoomView';
import GamePanel from '../GamePanel/gamePanel'
import {SocketContext} from "../../../context/socket";

const ENDPOINT = "http://localhost:3000";

const GameRoom = (props) => {

    console.log("Runing GameRoom component");


    //https://dev.to/bravemaster619/how-to-use-socket-io-client-correctly-in-react-app-o65
    const socketClient = React.useContext(SocketContext);

    const [roomState, updateState] = React.useState({ games: [], players: [], gameJoined: false,  playingGameId: null, playerId: null });
    const [socket, updateSocket] = React.useState(null);
    const [testState, setTestState] = React.useState(null);

    console.log("test state "+ testState);

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
            console.log("running roomStateUpdate");
            updateState(prevState => ({...prevState, games: data.games, players: data.players }));
        });

        socketClient.on("playerIdAssigned", data => {
            console.log("running playerIdAssigned");
            updateState(prevState => ({ ...prevState, playerId: data.playerId }));
        });

        socketClient.on("gameJoined", data => {
            console.log("running gameJoined");
            updateState(prevState => ({ ...prevState, gamJoined: true, playingGameId: data.gameId }));
        });

        //Once effect is run component is rerendered due to the multiple setstates. setstate within useEffect
        //doesnt stops effect and re-rerender. However, only
        //last of each state prevails in the render.
        console.log("setting test state");
        setTestState(1)
        console.log("setting socket state");
        setTestState(2);    
        console.log("setting socket state");
        setTestState(3);    

        updateSocket(socketClient);
    };

    React.useEffect(() => {

        console.log("Running use effect");
        socketInitialization();    
        socketClient.emit('newPlayerJoined', props.playerName);
        console.log("Finishing use effect");


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