/**
 * Short form for getting elements by id.
 * @param {string} id The id.
 */
function $(id) {
  return document.getElementById(id);
}

/**
 * Opens a singleton URL. Only one instance of that url is ever opened at
 * any time.
 * @param {string} url The url.
 */
function openSingletonPage(url) {
  var views = chrome.extension.getViews();
  for (var v in views) {
    var view = views[v];
    if (view.location.href.indexOf(url) == 0) {
      view.focus();
      return;
    }
  }
  chrome.tabs.create({url: url});
}

/**
 * Build own bind function that exposes all functions.
 * From Robert Sosinski
 *  http://www.robertsosinski.com/2009/04/28/binding-scope-in-javascript/
 *
 * @param {class} scope The class to bind this function to.
 * @return {function} The scoped function binded.
 */
Function.prototype.bind = function(scope) {
  var _function = this;
  return function() {
    return _function.apply(scope, arguments);
  }
};