"use strict";
const $ = require("jquery");


module.exports = function(){

$(document).ready(function(){
    console.log("oi");
    const socket = io();
    socket.on("message",function(data){
        console.log(data);
    });


    $("#messageSend").submit(function(e){
        e.preventDefault();

        var form = $(this);
        var message = form.find("input[name='message']").val();

// console.log("oi", message, message.length);
        if(message != "undefined" && message.length > 0){
            console.log("Sending message");
            // TODO: get all values from user
            socket.emit("message", {
                "message":message,
                "sender":"someone",
                "receiver":"someoneElse",
                "extra":"field",
                "custom":"attribute"
            });
        } else
            alert("You must provide a valid message");

    });

});
}
