// Extension constants for cross extension communication.
const MAIN_EXTENSION_ID = 'lokibimjbkmcgjjgheneclgpadfebdmn';
const EXTENSION_IPC_TIMEOUT = 2000;

// To validate the request if received.
var alive = false;

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


/**
 * Send a request to the main extension.
 * @param {string} p the protocol to execute.
 * @param {object} m the message to execute.
 */
function sendRequest(p, m) {
  alive = false;
  chrome.extension.sendRequest(main_extension_id, {protocol: p, message: m},
    function (response) {
      alive = true;
    }
  );
  setTimeout(handleResponse, EXTENSION_IPC_TIMEOUT);
}

/**
 * If the main extension is not alive, we redirect the user to the error page
 * which will inform them that there is an error.
 */
function handleResponse() {
  if (!alive) {
    openSingletonPage(chrome.extension.getURL('error.html'));
  }
}

// On browser action clicked!
chrome.browserAction.onClicked.addListener(function(tab) {
  openSingletonPage(chrome.extension.getURL('admin.html'));
});
