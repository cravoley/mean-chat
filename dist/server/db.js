'use strict';

module.exports = Database;

var mango = require("mongodb").MongoClient;
var url = 'mongodb://localhost:27017/chat';

function Database() {
    var _this2 = this;

    if (!(this instanceof Database)) return new Database();
    this.db;
    this.connect = function (callback) {
        var _this = this;

        if (callback == "undefined" || typeof callback != "function") callback = function callback(err, db) {};
        mango.connect(url, function (err, db) {
            if (!err) _this.db = db;
            callback(err, db);
        });
    };
    this.query = function () {
        // if(!this.isConnected()) this.connect();
        // console.log(this, this.db);
    };
    this.insertMessage = function (sender, receiver, message, callback) {
        console.log("Storing", sender, receiver, message);
        if (callback == "undefined" || typeof callback != "function") callback = function callback(err, result) {};
        _this2.connectAndExecute(function (err, db) {
            if (err) return callback(err);
            db.collection("messages").insertOne({
                "sender": sender,
                "receiver": receiver,
                "message": message
            }, callback);
        });
    };
    this.connectAndExecute = function (callback) {
        if (_this2.db) return callback(null, _this2.db);
        return _this2.connect(callback);
    };

    // connect at startup
    this.connect();
}

// Search messages and return a cursor
Database.prototype.getMessages = function (callback) {
    this.connectAndExecute(function (err, db) {
        if (err) return callback(err);
        return callback(null, db.collection("messages").find());
    });
};

// Get all messages for user 'socket' and transmit messages to that socket
Database.prototype.retrieveMessages = function (socket, callback) {
    // TODO: do not retrieve other users messages.
    if (callback == "undefined" || typeof callback != "function") callback = function callback() {}; // declare an empty function as callback
    this.getMessages(function (err, cursor) {
        if (err) return callback(err);
        var count = 0;
        cursor.each(function (err, doc) {
            if (err) return callback(err);

            if (doc != null) {
                count++;
                socket.emit("message", doc);
            } else {
                console.log("Done sending " + count);
                return callback(null);
            }
        });
    });
};