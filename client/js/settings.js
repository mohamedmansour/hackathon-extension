// Global Settings. Getters and Setters.
settings = {
  get version() {
    return localStorage['version'];
  },
  set version(val) {
    localStorage['version'] = val;
  },
  get websocket() {
    var key = localStorage['websocket'];
    return (typeof key == 'undefined') ? 'mohamedmansour.com:8080' : key;
  },
  set websocket(val) {
    localStorage['websocket'] = val;
  },
  get nick() {
    var key = localStorage['nick'];
    return (typeof key == 'undefined') ? '' : key;
  },
  set nick(val) {
    localStorage['nick'] = val;
  },
};

