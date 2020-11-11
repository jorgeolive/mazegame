import React from 'react';
import Player from '../player/Player';
import './cell.css';

const Cell = (props) => {

    
    let classes = 'cell';

    if(props.cell.hasTopWall) classes += ' topwall';
    if(props.cell.hasBottomWall) classes += ' bottomwall' ;
    if(props.cell.hasLeftWall)  classes += ' leftwall';
    if(props.cell.hasRightWall)  classes += ' rightwall' ;

    if(props.players.length > 0)
    console.log(`players ${props.players} for cell ${props.id}`);

    return <div className={classes}>
        {props.players.length > 0 ? props.players.map(player => <Player color={player.colorCode}></Player>) : null }
           </div>;
}

export default Cell;