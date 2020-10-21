import React from 'react';

const GameListView = (props) => {
    console.log("any games?" ,props.games != undefined && props.games.length > 0);
    console.log("games" ,props.games);

    return (<table>

        <thead>
            <tr>
                <th>Game Id</th>
                <th>Maze Height</th>
                <th>Maze Width</th>
                <th>Players</th>
                <th>Is Started</th>
            </tr>
        </thead>
        <tbody>
            {props.games != undefined && props.games.length > 0 ?
                props.games.map(game => {
                    console.log(game);
                    return (
                        <tr>
                            <td>{game.id}</td>
                            <td>{game.height}</td>
                            <td>{game.width}</td>
                            <td>{game.players.length}</td>
                            <td>{game.isStarted}</td>
                        </tr>);
                })
                : null}
        </tbody>
    </table>);
}

export default GameListView;