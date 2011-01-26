/**
 * Instantiates a connection to the websocket address.
 */
NotificationClient = function(address) {
  this.ws_ = new WebSocket('ws://' + address);
};

/**
 * Starts listening to the websocket.
 */
NotificationClient.prototype.start = function() {
  this.ws_.onopen = this.onConnectionOpen_.bind(this);
  this.ws_.onclose = this.onServerClose_.bind(this);
  this.ws_.onerror = this.onServerError_.bind(this);
  this.ws_.onmessage = this.onMessage_.bind(this);
};

/**
 * Fired when Websocket has successfully opened.
 */
NotificationClient.prototype.onConnectionOpen_ = function() {
  console.log('new nick: ' + settings.nick);
  this.ws_.send(JSON.stringify({
    command: NotificationCommand.NICK,
    message: settings.nick
  }));
};

/**
 * Fired when Websocket has closed.
 */
NotificationClient.prototype.onServerClose_ = function() {
  chrome.extension.sendRequest({
    command: NotificationCommand.ERROR,
    message: 'Server has disconnected.'
  });
  
  var notification = webkitNotifications.createNotification(
    '/img/online.png',
    'Hackathon',
    'Server has disconnected.'
  );
  notification.show();
};

/**
 * Fired when error happens.
 */
NotificationClient.prototype.onServerError_ = function(error) {
  chrome.extension.sendRequest({
    command: NotificationCommand.ERROR,
    message: error
  });
};

/**
 * Message received from server. Handle it.
 */
NotificationClient.prototype.onMessage_ = function(e) {
  console.log(e.data);
  var obj = JSON.parse(e.data);
  
  switch (obj.protocol) {
    case NotificationProtocol.NOTIFY:
      var notification = webkitNotifications.createNotification(
        '/img/online.png',
        'Hackathon',
        obj.message
      );
      notification.show();
      break;
    case NotificationProtocol.INFO:
      console.error('INFO protocol not yet implemented!');
      break;
    default:
      break;
  }

  // Send that message to the listeners.
  chrome.extension.sendRequest(obj);
};

/**
 * Checks if the websocket is active.
 */
NotificationClient.prototype.isActive = function() {
  return this.ws_.readyState == 1;
};

/**
 * Opens a chatting window.
 */
NotificationClient.prototype.openChatWindow = function() {
  openSingletonPage(chrome.extension.getURL('chat.html'));
};

NotificationClient.prototype.getSocket = function() {
  return this.ws_;
};