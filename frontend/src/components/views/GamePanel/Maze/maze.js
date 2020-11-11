import React from 'react';
import Cell from '../Maze/cell/Cell';

const Maze = (props) =>{

   //TODO no tiene sentido hacer el sort todas las veces...
    const cellOrderFunction = (a,b) => {
        if(a.i > b.i) 
           return 1;
        if(a.i < b.i)
           return -1;
        if(a.j > b.j)
           return 1;
        return -1;
      };

      let styles = {
          width : props.width * 20 + 'px',
          height: props.height * 20 + 'px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'left',
          backgroundColor: 'black'
      }
            
      console.log("Entries", Array.from(props.playerMap.entries()));
    return (<div style={styles}>
            {props.cells.
            sort(cellOrderFunction).
            map(cell => { 
              const players = props.playerMap.get(cell.id);
              return <Cell cell={cell} key = {cell.id} id = {cell.id} players = {players == null ? [] : players}></Cell>})}
           </div>);
}

export default Maze;