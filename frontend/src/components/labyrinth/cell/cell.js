import React from 'react';
import './cell.css';

const cell = (props) => {

    let classes = 'cell';

    if(props.cell.hasTopWall) classes += ' topwall';
    if( props.cell.hasBottomWall) classes += ' bottomwall' ;
    if(props.cell.hasLeftWall)  classes += ' leftwall';
    if(props.cell.hasRightWall)  classes += ' rightwall' ;

    console.log(classes);

    return <div className={classes}></div>;
}

export default cell;