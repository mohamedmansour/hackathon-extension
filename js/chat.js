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
    console.log(request);
    switch (request.method) {
      case 'MessageReceived':
        onMessageReceived(request.data);
        break;
      case 'NicklistReceived':
        onNicklistReceived(request.data);
        break;
      case 'UserJoined':
        onUserJoined(request.data);
        break;
      case 'UserParted':
        onUserParted(request.data);
        break;
      case 'ErrorReceived':
        onError(request.data);
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
function onUserJoined(nick) {
  addNick(nick.id, nick.name);
}

/**
 * Fired when user has parted.
 */
function onUserParted(nick) {
  removeNick(nick.id);
}

/**
 * Fired when error has occurred.
 */
function onError(error) {
  alert(error);
}

/**
 * Fired when nicklist has been recieved.
 */
function onNicklistReceived(nicklist) {
  for (var i in nicklist) {
    var nick = nicklist[i];
    addNick(nick.id, nick.name);
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
  var item = document.createElement('li');
  item.innerHTML = nick;
  item.setAttribute('id', id);
  nicklist.appendChild(item);
}