var chatlog = null;
var nicklist = null;
var chatinput = null;

window.addEventListener('load', onLoad, false);

/**
 * Fired when Chat DOM has completely loaded.
 */
function onLoad(e) {
  chatlog = document.getElementById('chatlog');
  nicklist = document.getElementById('nicklist');
  chatinput = document.getElementById('chatinput');
  chatinput.onkeypress = onInputKeyPress;
  chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    switch (request.command) {
      case NotificationCommand.MSG:
        if (request.protocol == NotificationProtocol.CHAT) {
          onMessageReceived(request.message);
        }
        break;
      case NotificationCommand.NICKLIST:
        onNicklistReceived(request.message);
        break;
      case NotificationCommand.JOIN:
        onUserJoined(request.message);
        break;
      case NotificationCommand.PART:
        onUserParted(request.message);
        break;
      case NotificationCommand.ERROR:
        onError(request.message);
      default:
        break;
    }
    sendResponse({});
  });
}

/**
 * Fired when presses enter key.
 */
function onInputKeyPress(e) {
  var key = e.keyCode || e.which;
  if (key == 13) {
    ws.send(chatinput.value);
    chatinput.value = '';
  }
}

/**
 * Fires when message has been received.
 */
function onMessageReceived(msg) {
  chatlog.innerHTML += '\n' + msg;
}

/**
 * Fired when user has joined.
 */
function onUserJoined(user) {
  addNick(user.id, user.nick);
}

/**
 * Fired when user has parted.
 */
function onUserParted(user) {
  removeNick(user.id);
}

/**
 * Fired when error has occurred.
 */
function onError(error) {
  onMessageReceived('ERROR: ' + error);
}

/**
 * Fired when nicklist has been recieved.
 */
function onNicklistReceived(nicklist) {
  for (var i in nicklist) {
    var user = nicklist[i];
    addNick(i, user.nick);
  }
}

/**
 * Removes Nick from the userlist.
 */
function removeNick(id) {
  var item = document.getElementById(id);
  if (item) {
    item.parentNode.removeChild(item);
  }
}

/**
 * Adds Nick to the userlist.
 */
function addNick(id, nick) {
  var existsItem = document.getElementById(id);
  if (existsItem) {
    existsItem.innerHTML = nick;
  }
  else {
    var item = document.createElement('li');
    item.innerHTML = nick;
    item.setAttribute('id', id);
    nicklist.appendChild(item);
  }
}