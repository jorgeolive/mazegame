import React, { useEffect, useState } from 'react';
import './App.css';
import Shell from './components/labyrinth/shell/shell';
const axios = require('axios');

function App() {

  const [state, updateState] = useState({labyrinth: null, loading: true});

  useEffect(() => {
    axios.post('http://localhost:3000/maze', {
      width: 20,
      height: 20
    })
    .then((resp) => {
      console.log(resp.data);
      updateState( (state) => ({...state, cells: resp.data.cells, adjancecyList: resp.data.adjancecyList, loading: false}))
    })
    .catch(function (error) {
      console.log(error);
    })}
    ,
   []);

  return (
    state.loading ? 
    <div>loading..</div> :
    <div>
     <Shell cells={state.cells} width = {20} height = {20} ></Shell>
    </div>
  );
}

export default App;
