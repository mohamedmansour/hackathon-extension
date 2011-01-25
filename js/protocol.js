/**
 * Notification communication that gets sent through the wire.
 * @enum {number}
 */
NotificationProtocol = {
  CHAT     : 0, /* Notifies the users log */
  NOTIFY   : 1, /* Notifies WebKit Notifications */
  INFO     : 2, /* Notifies Chrome Extension Infobar */
};