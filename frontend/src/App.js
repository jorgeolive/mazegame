import React, { useEffect, useState } from 'react';
import './App.css';
import GameRoom from './components/views/GameRoom/GameRoom';
import PlayerNameInput from './components/menu/PlayerNameInput';
//import Shell from './components/views/GamePanel/Maze/shell/shell';
//import GameStart from './components/menu/newGame/newGame';
//import Player from './model/player';

//const axios = require('axios');

function App() {

  /*const [state, updateState] = useState({ labyrinth: [], loading: true, players: [] });

  const placePlayer = () => {
    debugger;
    let randomCell = state.labyrinth[Math.floor(Math.random() * state.labyrinth.length)];
    updateState((state) => ({
      ...state, 
       players: [
         ...state.players,
          new Player(Math.floor(Math.random()*1000), randomCell.id)]
        }))
  }

  useEffect(() => {
    axios.post('http://localhost:3000/maze', {
      width: 20,
      height: 20
    })
      .then((resp) => {
        updateState((state) => ({ ...state, labyrinth: resp.data.cells, adjancecyList: resp.data.adjancecyList, loading: false }))
      })
      .catch(function (error) {
        console.log(error);
      })
  }
    ,
    []);

  const styles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const flexItemStyle = {
    padding: '20px 20px 20px 20px'
  }
*/

  /*state.loading ?
        <div>loading..</div> :
        <div style={styles}>
          <div style={flexItemStyle}>
            <Shell cells={state.labyrinth} players = {state.players} width={20} height={20} ></Shell></div>
          <div style={flexItemStyle}><GameStart startGameHandler={placePlayer}></GameStart></div>
        </div>*/


  const [state, updateState] = useState({ playerName : "" });      
  const styles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const flexItemStyle = {
    padding: '20px 20px 20px 20px'
  }

  let setNameHandler = (name) => {
    if(name !== state.playerName)
      updateState((prevState) => ({playerName : name}));
  }

  return (
    <div style={styles}>
      <div style={flexItemStyle}>
        {state.playerName == "" ?
          <PlayerNameInput setNameHandler = {setNameHandler}></PlayerNameInput>
        : <GameRoom playerName={state.playerName}></GameRoom>
      }
      </div>
    </div>
  );
}

export default App;