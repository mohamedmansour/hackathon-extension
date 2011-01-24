// Synchronously retrieve the current extension version.
var version = 'NaN';
var xhr = new XMLHttpRequest();
xhr.open('GET', chrome.extension.getURL('manifest.json'), false);
xhr.send(null);
var manifest = JSON.parse(xhr.responseText);
var currVersion = manifest.version;
var prevVersion = settings.version;

// Check if the extension has been just updated or installed.
if (currVersion != prevVersion) {
  if (typeof prevVersion == 'undefined') {
    // onInstall: Do nothing now.
  }
  else {
    // onUpdate: Do nothing now. 
  }  
  settings.version = currVersion;
}

// On browser action clicked!
chrome.browserAction.onClicked.addListener(function(tab) {
  openSingletonPage(chrome.extension.getURL('chat.html'));
});

// Start the connection to the server.
var notificationClient = new NotificationClient(settings.websocket);
notificationClient.start();