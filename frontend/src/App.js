import React, { useEffect, useState } from 'react';
import './App.css';
import GameRoom from './components/views/GameRoom/GameRoom';
import PlayerNameInput from './components/views/menu/playerNameInput';
import { SocketContext, socket } from '../src/context/socket';

function App() {

  const [state, updateState] = useState({ playerName: "" });
  const styles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const flexItemStyle = {
    padding: '20px 20px 20px 20px'
  }

  let setNameHandler = (name) => {
    if (name !== state.playerName)
      updateState((prevState) => ({ playerName: name }));
  }

  return (
    <SocketContext.Provider value={socket}>
      <div style={styles}>
        <div style={flexItemStyle}>
          {state.playerName == "" ?
            <PlayerNameInput setNameHandler={setNameHandler}></PlayerNameInput>
            : <GameRoom playerName={state.playerName}></GameRoom>
          }
        </div>
      </div>
    </SocketContext.Provider>
  );
}

export default App;