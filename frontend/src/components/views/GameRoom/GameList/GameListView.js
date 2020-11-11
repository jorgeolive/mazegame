import React from 'react';

const GameListView = (props) => {

    return (
    <table>
          <thead>
            <tr>
                <th>Game Id</th>
                <th>Maze Height</th>
                <th>Maze Width</th>
                <th>Players</th>
                <th>Is Started</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {props.games != undefined && props.games.length > 0 ?
                props.games.map(game => {
                    return (
                        <tr>
                            <td>{game.id}</td>
                            <td>{game.height}</td>
                            <td>{game.width}</td>
                            <td>{game.numberOfPlayers}</td>
                            <td>{game.isStarted}</td>
                            <td><button onClick={(event) => {props.onGameJoinHandler(game.id);}}>join!</button></td>
                        </tr>);
                })
                : null}
        </tbody>
    </table>);
}

export default GameListView;