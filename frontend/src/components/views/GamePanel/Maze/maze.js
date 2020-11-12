import React from 'react';
import Cell from '../Maze/cell/Cell';

const Maze = (props) => {

   //TODO no tiene sentido hacer el sort todas las veces...
   /*const cellOrderFunction = (a,b) => {
       if(a.i > b.i) 
          return 1;
       if(a.i < b.i)
          return -1;
       if(a.j > b.j)
          return 1;
       return -1;
     };*/

   let styles = {
      width: props.width * 20 + 'px',
      height: props.height * 20 + 'px',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'left',
      backgroundColor: 'black'
   }

   const playersByCell = Array.from(props.playerMap.entries());

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
   
   return (<div style={styles}>
      {props.cells.
         map(cell => {
            const players = getPlayers(playersByCell, cell.id);
            return <Cell cell={cell} key={cell.id} id={cell.id} players={players}></Cell>
         })}
   </div>);
}

export default Maze;