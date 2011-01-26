NotificationCommand = {
  NICK: 'NICK',
  MSG: 'MSG',
  JOIN: 'JOIN',
  PART: 'PART',
  NICKLIST: 'NICKLIST'
};

NickCommand = {};
NickCommand.onMessage = function(server, conn, message) {
  var user = server.getUser(conn.id);
  if (message && message != '') {
    user.nick = message;
  }
  server.broadcast({nick: user.nick, id: conn.id}, NotificationCommand.JOIN);
};

MsgCommand = {};
MsgCommand.onMessage = function(server, conn, message) {
  var user = server.getUser(conn.id);
  server.broadcast({nick: user.nick, id: conn.id, message: message},
                   NotificationCommand.MSG);
};

NicklistCommand = {};
NicklistCommand.onMessage = function(server, conn, message) {
  var users = server.getUsers();
  server.send(conn, {id: conn.id, users: users}, NotificationCommand.NICKLIST);
};

