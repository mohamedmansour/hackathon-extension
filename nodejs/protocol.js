/**
 * Notifification protocol that defines what protocol to send the message to.
 * @enum {number
 */
NotificationProtocol = {
  CHAT     : 0, /* Notifies the users log */
  NOTIFY   : 1, /* Notifies WebKit Notifications */
  INFO     : 2, /* Notifies Chrome Extension Infobar */
};

