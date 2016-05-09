'use strict';


module.exports = Database;

const mango = require("mongodb").MongoClient;
const url = 'mongodb://localhost:27017/chat';

function Database(){
    if(!(this instanceof Database)) return new Database();
    this.db;
    this.connect = function(callback){
        if(callback == "undefined" || typeof callback != "function") callback = (err,db)=>{};
        mango.connect(url, (err, db) =>{
            if(!err)
                this.db = db;
            callback(err, db);
        });
    };
    this.query = () => {
        // if(!this.isConnected()) this.connect();
        // console.log(this, this.db);
    };
    this.insertMessage = (sender, receiver, message, callback) =>{
        console.log("Storing", sender, receiver, message);
        if(callback == "undefined" || typeof callback != "function") callback = (err, result) => {};
        this.connectAndExecute((err, db) =>{
            if(err) return callback(err);
            db.collection("messages").insertOne({
                "sender" : sender,
                "receiver" : receiver,
                "message" : message
            }, callback);
        });

    };
    this.connectAndExecute = (callback) => {
        if(this.db) return callback(null, this.db);
        return this.connect(callback);
    };

    // connect at startup
    this.connect();
}


// Search messages and return a cursor
Database.prototype.getMessages = function (callback) {
    this.connectAndExecute((err, db)=>{
        if(err) return callback(err);
        return callback(null,
            db.collection("messages")
            .find());
    });
};

// Get all messages for user 'socket' and transmit messages to that socket
Database.prototype.retrieveMessages = function (socket, callback) {
    // TODO: do not retrieve other users messages.
    if(callback == "undefined" || typeof callback != "function") callback = () => {}; // declare an empty function as callback
    this.getMessages((err, cursor)=>{
        if(err) return callback(err);
        var count = 0;
        cursor.each(function(err, doc) {
            if(err) return callback(err);

            if (doc != null) {
                count++;
                socket.emit("message", doc);
          } else {
              console.log("Done sending "+count);
              return callback(null);
          }
       });
    });
};
