var client_id = null;
var chatlog = null;
var nicklist = null;
var chatinput = null;
var notify = chrome.extension.getBackgroundPage().notificationClient;

window.addEventListener('load', onLoad, false);
window.addEventListener('resize', resizeSidebar, false);

/**
 * Fired when Chat DOM has completely loaded.
 */
function onLoad(e) {
  resizeSidebar();
  chatlog = document.querySelector('#chatlog ul');
  nicklist = document.querySelector('#nicklist ul');
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
  
  // Send a message to the server asking it to retrieve the nick list.
  notify.send(JSON.stringify({
    command: NotificationCommand.NICKLIST
  }));
  
}

/**
 * Fluid layout.
 */
function resizeSidebar(){
    var h = window.innerHeight - 130; 
    document.getElementById('nicklist').style.height = h + 'px';
    document.getElementById('chatlog').style.height = h + 'px';
}

/**
 * @param {object} msg The message obj.
 * @returns {string} formatted message.
 */
function format(msg) {
  var date = new Date();
  return '<span class="time">' +
            twoDigitsFormat(date.getHours()) + ':' +
            twoDigitsFormat(date.getMinutes()) + ':' +
            twoDigitsFormat(date.getSeconds()) + 
          '</span> ' +
          '<span class="separation">&lt;</span> ' +
          '<span class="nick">' + msg.nick + '</span> ' +
          '<span class="separation">&gt;</span> ' + 
          '<span class="message">' + msg.message + '</span>';
}

/**
 * Add a leading 0 if necessary.
 */
function twoDigitsFormat(num) {
  return (num <10) ? '0'+ num : num;
}

/**
 * Fired when presses enter key.
 */
function onInputKeyPress(e) {
  var key = e.keyCode || e.which;
  if (key == 13) {
    notify.send(JSON.stringify({
      command: NotificationCommand.MSG,
      message: chatinput.value
    }));
    chatinput.value = '';
  }
}

/**
 * Fires when message has been received.
 */
function onMessageReceived(msg) {
  var mine = client_id == msg.id;
  var item = document.createElement('li');
  if (mine) {
    item.setAttribute('class', 'mine');
  }
  item.innerHTML = format(msg);
  chatlog.appendChild(item);
  chatlog.parentNode.scrollTop = chatlog.parentNode.scrollHeight;
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
  client_id = nicklist.id;
  var users = nicklist.users;
  for (var i in users) {
    addNick(i, users[i].nick);
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