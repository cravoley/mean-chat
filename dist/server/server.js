"use strict";
/* eslint no-console: 0 */

var path = require('path');
var express = require('express');
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('../../webpack.config.js');

var isDeveloping = process.env.NODE_ENV !== 'production';
var port = isDeveloping ? 3000 : process.env.PORT;
var app = express();
var http = require('http').Server(app);
var db = require("./db")();

// handle sockets request
var io = require('./io');
io = io(http);
io.on("connection", function (s) {
  db.retrieveMessages(s);
  s.on('message', function (data) {
    console.log(data);
    // get only sender, receiver and message objects from data
    var sender = data.sender;
    var receiver = data.receiver;
    var message = data.message; //NOT YET IMPLEMENTED IN NODE

    db.insertMessage(sender, receiver, message, function (err, result) {
      // console.log("Oi",result);
      // TODO: implement a retry mechanism
      if (err) return s.emit("message", { "error": true, message: "Something went wrong. Please, to send your message again." });
      s.emit("message", { "error": false });
    });
  });
});

if (isDeveloping) {
  (function () {
    var compiler = webpack(config);
    var middleware = webpackMiddleware(compiler, {
      publicPath: config.output.publicPath,
      contentBase: 'src',
      stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false
      }
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
    app.get('*', function response(req, res) {
      res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
      res.end();
    });
  })();
} else {
  app.use(express.static(__dirname + '/dist'));
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

http.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});