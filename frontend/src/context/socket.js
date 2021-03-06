import socketio from "socket.io-client";
import React, { useEffect, useState } from 'react';

console.log("Hi i am socket.js and I am executing");
const socketConf = {
    "force new connection": true,
    "reconnectionAttempts": "Infinity",
    "timeout": 10000,
    transports: ['websocket', 'polling', 'flashsocket']
};

const ENDPOINT = "http://localhost:3000";

export const socket = socketio.connect(ENDPOINT, socketConf);
export const SocketContext = React.createContext();