import React, { Profiler } from 'react';
import Maze from './Maze/maze';
import { SocketContext } from "../../../context/socket";
import Waiting from '../Waiting/waiting';

const GamePanel = React.memo(({ gameId, playerId }) => {

  const socket = React.useContext(SocketContext);

  const [socketState, updateSocket] = React.useState(socket);
  const [gameState, updateGameState] = React.useState(
    {
      gotMap: false,
      gameStarted: false,
      adjancecyList: [],
      cells: [],
      players: [],
      gameId: gameId,
      playerId: playerId,
      width: 20,
      height: 20,
      playerMap: null,
      monsterMap: null,
      goodieMap: null
    });
  const [gameOver, updateGameOver] = React.useState(false);
  const [allPlayersJoined, updateAllPlayersJoined] = React.useState(false);

  React.useEffect(() => 
  {

    socketState.emit('joinGame', { gameId });
    socketState.on("allPlayersJoined", x => updateAllPlayersJoined(true));

    socketState.on("gameData", data => {
      updateGameState(prevState => ({
        ...prevState,
        gotMap: true, adjancecyList: data.mazeData.adjancecyList, cells: data.mazeData.cells,
        players: data.mazeData.players, height: data.mazeData.height, width: data.mazeData.width,
        playerMap: new Map(data.mazeData.playerMap),
        monsterMap: new Map(data.mazeData.monsterMap),
        goodieMap : new Map(data.mazeData.goodieMap)
      }));

      socketState.emit("gameDataACK", { playerId: playerId });
    });

    socketState.on("gameStateUpdated",
      data => {
        console.log(data);
        updateGameState(prevState => ({ ...prevState, playerMap: new Map(data.playerMap), monsterMap: new Map(data.monsterMap), goodieMap : new Map(data.goodieMap) }));
      });

    socketState.on("gameEvent",
      data => {
        if (data.eventType === "playerCaught" && playerId === data.playerId) {
          updateGameOver(true);
        }

        if (data.eventType === "pointsUpdated" && playerId == data.player.id) {
          updateGameState(prevState => {

            debugger;
            let newPlayerArray = prevState.players.filter(x => x.id != playerId);
            newPlayerArray.push(data.player);
    
            return { ...prevState, players : newPlayerArray} });
      }
    });

    socketState.on("gameStarted",
      data => {
        updateGameState(prevState => ({ ...prevState, gameStarted: true }));

        document.addEventListener('keydown', e => {
          e.preventDefault();
          const key = e.key;
          switch (key) {
            case "ArrowLeft":
            case "ArrowRight":
            case "ArrowUp":
            case "ArrowDown":
              socketState.emit('newMovement', { playerId: playerId, direction: key });
              break;
            default:
              break;
          }
        });
      });

    return () => {
      socketState.disconnect();
      document.removeEventListener('keydown');
    }
  }, []);

  const styles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const flexItemStyle = {
    padding: '20px 20px 20px 20px'
  }

  const callback = (id, phase, actualTime, baseTime, startTime, commitTime) => {
    //console.log(`${id}'s ${phase} phase:`);
    //console.log(`Actual time: ${actualTime}`);
    //console.log(`Base time: ${baseTime}`);
    //console.log(`Start time: ${startTime}`);
    //console.log(`Commit time: ${commitTime}`);
  }

  if (gameOver)
    return <div>You got caught by one of those horrible CSS circles!</div>;

  return (gameState.gotMap && gameState.gameStarted ?
    <div style={styles}>
      <div style={flexItemStyle}>
        <Profiler id="Maze" onRender={callback}>
          <Maze cells={gameState.cells} players={gameState.players}
            adjancecyList={gameState.adjancecyList}
            width={gameState.width} height={gameState.height}
            playerMap={gameState.playerMap}
            monsterMap={gameState.monsterMap}
            goodieMap={gameState.goodieMap}>
          </Maze>
        </Profiler>
      </div>
    </div> :
    <Waiting allPlayersJoined={allPlayersJoined}></Waiting>
  );


});

export default GamePanel;