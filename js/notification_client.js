/**
 * Notification communication that gets sent through the wire.
 * @enum {number}
 */
NotificationProtocol = {
  CHAT     : 0, /* Notifies the users log */
  NOTIFY   : 1, /* Notifies WebKit Notifications */
  INFO     : 2, /* Notifies Chrome Extension Infobar */
};

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
  this.ws_.send(JSON.stringify({
    command: 'NICK',
    data: settings.nick
  }));
};

/**
 * Fired when Websocket has closed.
 */
NotificationClient.prototype.onServerClose_ = function() {
  chrome.extension.sendRequest({
    method: 'ErrorReceived',
    data: 'Server has disconnected.'
  });
};

/**
 * Fired when error happens.
 */
NotificationClient.prototype.onServerError_ = function(error) {
  chrome.extension.sendRequest({
    method: 'ErrorReceived',
    data: error
  });
};

/**
 * Message received from server. Handle it.
 */
NotificationClient.prototype.onMessage_ = function(e) {
  console.log(e.data);
  var obj = JSON.parse(e.data);
  switch (obj.protocol) {
    case NotificationProtocol.CHAT:
      chrome.extension.sendRequest({
        method: 'MessageReceived',
        data: obj.message
      });
      break;
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
};

/**
 * Checks if the websocket is active.
 */
NotificationClient.prototype.isActive = function() {
  return this.ws_.readyState == 1;
};