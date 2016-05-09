"use strict";
/* eslint no-console: 0 */

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../../webpack.config.js');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();
const http = require('http').Server(app);
const db = require("./db")();

// handle sockets request
var io = require('./io');
io = io(http);
io.on("connection",s=>{
    db.retrieveMessages(s);
    s.on('message',function(data){
        // console.log(data);
        // get only sender, receiver and message objects from data
        var {sender, receiver, message} = data; //NOT YET IMPLEMENTED IN NODE
        db.insertMessage(sender, receiver, message, function(err, result){
            // console.log("Oi",result);
            // TODO: implement a retry mechanism
            if(err) return s.emit("message", {"error":true, message:"Something went wrong. Please, to send your message again."});

            // maybe this may be removed.
            s.emit("message", {"error":false});
        })
    });
});


if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
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
