var ws = require('./lib/websocket/ws/server');
require('./protocol');
require('./commands');
require('./functions');

/**
 * Notification Server that uses HTML WebSockets for its main form of
 * communication.
 * @param {number} port The port number to run the server.
 */
NotificationServer = function(port) {
  this.port_ = port;
  this.server_ = ws.createServer();
  this.users_ = {};
  this.log_ = [];
  this.commands_ = {};
  this.init();
};

/**
 * Initialize the listeners to handle the various notifications..
 */
NotificationServer.prototype.init = function() {
  
  this.commands_ = {
    'NICK': NickCommand,
    'MSG': MsgCommand,
    'NICKLIST': NicklistCommand
  };
  
  this.server_.addListener('request', this.onWebRequest.bind(this));
  this.server_.addListener('listening', this.onListen.bind(this));
  this.server_.addListener('disconnect', this.onDisconnect.bind(this));
  this.server_.addListener('connection', function(conn) {
    this.onConnection(conn);
    conn.addListener('message', this.onMessage.bind(this, [conn]));
  }.bind(this));
  setInterval(this.onCleanup.bind(this), 10000);
};

/**
 * Simple Static Web Server
 */
NotificationServer.prototype.onWebRequest = function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('You would need an extension to communicate with me.');
  res.end();
};

/**
 * Fires when server successfully listened.
 */
NotificationServer.prototype.onListen = function() {
  syslog('onListen: port ' + this.port_);
};

/**
 * Fires when a new connection has been made.
 */
NotificationServer.prototype.onConnection = function(conn) {
  syslog('onConnection: from ' + conn.id);

  // Store this user to the map so we can do quick retreivals.
  this.users_[conn.id] = {
    nick: 'chromie_' + conn.id,
    data: {
      message_count: 0
    }
  };

  // Spit out all the previous log to the user when they connected.
  for (var i = 0; i < this.log_.length; i++) {
//    conn.send(this.log_[i]);
  }
};

/**
 * Fires when the connection sent a message.
 */
NotificationServer.prototype.onMessage = function(conn, message) {
  var user = this.users_[conn.id];
  syslog('> ' + message);
  var obj = JSON.parse(message);
  var cmd = this.commands_[obj.command];
  if (cmd) {
    cmd.onMessage(this, conn, obj.message);
  } else {
    syslog('ERROR MESSAGE: ' + obj.command)
  }
};

/**
 * Fires when a user is being disconnected.
 */
NotificationServer.prototype.onDisconnect = function(conn) {
  var user = this.users_[conn.id].nick;
  syslog('onDisconnect: ' + user);
  this.broadcast({nick: user, id: conn.id}, NotificationCommand.PART);
  delete this.users_[conn.id];
};

/**
 * Fired when its time to free up resources.
 */
NotificationServer.prototype.onCleanup = function() {
  // Only keep the last 100 messages in the log. Dispose the rest.
  if (this.log_.length > 100) {
    this.log_ = this.log_.slice(100);
  }
};

/**
 * @returns {object} List of connected users.
 */
NotificationServer.prototype.getUsers = function() {
  return this.users_;
};

/**
 * @returns {object} A single user.
 */
NotificationServer.prototype.getUser = function(id) {
  return this.users_[id];
};

/**
 * Start listening for connections.
 */
NotificationServer.prototype.start = function() {
  this.server_.listen(this.port_);
};

/**
 * Broadcast a message to all the available
 */
NotificationServer.prototype.broadcast = function(message, command, protocol) {
  this.log_.push(message);
  this.server_.broadcast(JSON.stringify({
    command: command ? command : NotificationCommand.MSG,
    protocol: protocol ? protocol : NotificationProtocol.CHAT,
    message: message
  }));
};

NotificationServer.prototype.send = function(conn, message, command, protocol) {
  conn.send(JSON.stringify({
    command: command ? command : NotifiationCommand.MSG,
    protocol: protocol ? protocol : NotificationProtocol.CHAT,
    message: message
  }));
};
