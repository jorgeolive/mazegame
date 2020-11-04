import React, {useState} from 'react';

const PlayerNameInput = (props) => {

    const [state, updateState] = useState({ playerName: "" });

    let updateName = (event) => { 
        event.persist(); 
        updateState((old) => ({ playerName: event.target.value })); }

    return (
    <div>
        <h1>Introduce your nickname.</h1>
        <input onChange={(event) => updateName(event)} value={state.playerName}></input>
        <button onClick={(event) => props.setNameHandler(state.playerName)}>Join room!</button>
    </div>);
}

export default PlayerNameInput;