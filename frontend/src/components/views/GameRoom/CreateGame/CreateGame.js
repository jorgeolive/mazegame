import React from 'react';

const CreateGame = (props) => {

    const [formState, setState] = React.useState({ width: 0, height: 0, maxPlayers: 0});

    const updateFormState = (value, field) => {
        setState((oldState) => ({ ...oldState, [field]: value.target.value }));
    };

    return (
        <div>
            <button onClick={() => props.createGameHandler(formState)}>Create Game</button>
            <label htmlFor="width">Width</label>
            <input type='number' name="width" onChange={(event) => {event.persist(); updateFormState(event, "width")}}></input>
            <label htmlFor="height">Height</label>
            <input type='number'name="height" onChange={(event) => {event.persist(); updateFormState(event, "height")}}></input>
            <label htmlFor="height">Players</label>
            <input type='number'name="height" onChange={(event) => {event.persist(); updateFormState(event, "maxPlayers")}}></input>
        </div>
    );
}

export default CreateGame;