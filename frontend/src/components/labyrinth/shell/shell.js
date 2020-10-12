import React from 'react';
import Cell from '../cell/cell';

const shell = (props) =>{

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
            
    return (<div style={styles}>
            {props.cells.
            sort(cellOrderFunction).
            map(cell => {
                return <Cell cell={cell} key = {cell.id}></Cell>})}
           </div>);
}

export default shell;