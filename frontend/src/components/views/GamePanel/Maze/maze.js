import React from 'react';
import Cell from '../Maze/cell/cell';

const Maze = (props) => {

   let styles = {
      width: props.width * 20 + 'px',
      height: props.height * 20 + 'px',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'left',
      backgroundColor: 'black'
   }

   

   const playersByCell = Array.from(props.playerMap.entries());
   const monstersByCell = Array.from(props.monsterMap.entries());
   const goodies = props.goodieMap;

   const getPlayers = (playersByCell, cellId) => {

      const players = [];
      const ids = playersByCell.filter(x => x[1] === cellId);

      ids.forEach(x => {
         const results = props.players.filter(y => y.id === x[0]);
         if (results.length > 0) {
            players.push(results[0]);
         }
      });

      return players;
   }

   const getMonsters = (monsters, cellId) => {
      const monsters_ = [];
      const ids = monsters.filter(x => x[1] === cellId);

      ids.forEach(x => {
         monsters_.push(ids[0]);
      });

      return monsters_;
   }
debugger;

   return (
   <div>
      <div>
      {props.players.map(x => {return <span>Player {x.name} - {x.points} points</span>})}
      </div>
      <div style={styles}>
         {props.cells.
            map(cell => {
               return <Cell cell={cell} key={cell.id} id={cell.id}
                  players={getPlayers(playersByCell, cell.id)}
                  monsters={getMonsters(monstersByCell, cell.id)}
                  goodie={props.goodieMap.has(cell.id) ? props.goodieMap.get(cell.id) : null}></Cell>
            })}
      </div>
   </div>);
}

export default Maze;