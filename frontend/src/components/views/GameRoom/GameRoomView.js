import React from 'react';
import GameListView from './GameList/GameListView';
import CreateGame from './CreateGame/CreateGame';
import PlayerListView from './PlayerList/PlayerListView';

const GameRoomView = (props) => {

    return (
    <div>
        <h1>Maze Game Room</h1>
     <GameListView games= {props.games} onGameJoinHandler= {props.onGameJoinHandler}></GameListView>   
     <CreateGame createGameHandler = {props.createGameHandler}></CreateGame>
     <PlayerListView players = {props.players}></PlayerListView>
    </div>);
}

export default GameRoomView;