import React from 'react';

const Player = (props) => {
    debugger;
    const style = {

        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: `${props.color}`,
        position: 'absolute',
        cursor: 'move'
    };

    return <div style={style}></div>
}
export default Player;