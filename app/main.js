import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';

ReactDOM.render(<App />, document.getElementById('root'));


const socket = io("?name=Valdo&amp;city=Cidade");
socket.on("connection",function(s){
    clients.push(s);
    console.log(s);
})

socket.on("message",function(data){
    console.log(data);
})
