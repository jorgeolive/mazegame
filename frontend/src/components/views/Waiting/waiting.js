import React  from 'react';
import {SocketContext} from "../../../context/socket";

const Waiting = ({allPlayersJoined}) => {

    const [progress, updateProgress] = React.useState(0);

    const socket = React.useContext(SocketContext);

    React.useEffect(() => {
        socket.on("progressStatus", data => {updateProgress(data.progress);});
    },[]);

    return allPlayersJoined ? 
    <div>Preparing map!!!! {progress} %</div> :
    <div>Waiting for other players!</div>;
}

export default Waiting;
