import React from 'react';
import Maze from './Maze/Maze';

const GamePanelView = (props) => {

    const styles = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    
      const flexItemStyle = {
        padding: '20px 20px 20px 20px'
      }

    return (
        <div style={styles}>
          <div style={flexItemStyle}>
            <Maze cells={state.labyrinth} players = {state.players} width={20} height={20} ></Maze></div>
          <div style={flexItemStyle}><GameStart startGameHandler={placePlayer}></GameStart></div>
        </div>
    );
}

export default GamePanelView; 