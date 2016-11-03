/* eslint no-console: 0 */

var path = require('path');
var express = require('express');
var isDeveloping = process.env.NODE_ENV !== 'production';
var port = isDeveloping ? 3000 : process.env.PORT;
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var shortid = require('shortid');

app.get('/', function(req, res) {
  var uuid = shortid.generate()
  res.redirect(`/${uuid}`)
  app.use(express.static(path.join(__dirname, '../dist')));
  var nsp = io.of(`/${uuid}`)
  var usercount = 0;

  nsp.on('connection', function(socket) {
    
    socket.emit('connected', usercount++)
    
    socket.on('player_moved', function(state) {
      nsp.emit('player_moved', state);
    });

    socket.on('set_active_player', function(activePlayer) {
      socket.broadcast.emit('set_active_player', activePlayer);
    });
    
    socket.on('chat_message', function(message) {
      socket.broadcast.emit('chat_message', message);
    });

    socket.on('winner', function(color) {
      nsp.emit('winner', color);
    });

    socket.on('disconnect', function () {
      nsp.emit('disconnected', usercount--);
    });

  });

  app.get('/:uuid', function(req, res) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
});

http.listen(port, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
