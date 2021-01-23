import React from 'react';
import Player from '../player/player';
import './cell.css';
import Monster from '../monster/monster'

const Cell = (props) => {

    let classes = 'cell';

    if(props.cell.hasTopWall) classes += ' topwall';
    if(props.cell.hasBottomWall) classes += ' bottomwall' ;
    if(props.cell.hasLeftWall)  classes += ' leftwall';
    if(props.cell.hasRightWall)  classes += ' rightwall' ;

    return <div className={classes}>
        {props.players.length > 0 ? props.players.map(player => <Player color={player.colorCode}></Player>) : null }
        {props.monsters.length > 0 ? props.monsters.map(() => <Monster></Monster>) : null }

           </div>;
}

export default Cell;