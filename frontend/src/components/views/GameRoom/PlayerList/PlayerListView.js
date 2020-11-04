import React from 'react';

const PlayerListView = ({ players }) => {
    return (
        <div>
            <table>
                <thead>
                    <tr>Player</tr>
                    <tr>Joined</tr>
                </thead>
                <tbody>
                    {players != undefined && players.length > 0 ?
                        players.map(player => {
                            return (
                                <tr>
                                    <td>{player.name}</td>
                                    <td>{player.joined}</td>
                                </tr>);
                        })
                        : null}
                </tbody>
            </table>
        </div>
    )
}

export default PlayerListView;