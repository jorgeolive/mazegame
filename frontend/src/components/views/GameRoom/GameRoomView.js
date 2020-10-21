import React from 'react';
import GameListView from './../GameRoom/GameList/GameListView';
import CreateGame from './../GameRoom/CreateGame/CreateGame';

const GameRoomView = (props) => {

    return (
    <div>
        <h1>Maze Game Room</h1>
     <GameListView games= {props.games}></GameListView>
     <CreateGame createGameHandler = {props.createGameHandler}></CreateGame>
    </div>);
}

export default GameRoomView;