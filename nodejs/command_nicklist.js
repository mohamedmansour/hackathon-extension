NicklistCommand = function(server) {
  this.server_ = server;
};

NicklistCommand.prototype.onMessage = function(conn, message) {
  var users = this.server_.getUsers();
  syslog(users[conn.id].nick);
  this.server_.send(conn, users, NotificationCommand.NICKLIST); 
};
