const { contextBridge } = require('electron');

// Expose protected methods that allow the renderer process to use
// specific electron APIs without exposing the entire electron API
contextBridge.exposeInMainWorld(
  'electron', {
    appInfo: {
      name: 'MedTrack',
      version: '1.0.0',
      platform: process.platform
    },
    // Add any additional APIs here that you want to expose to the renderer process
    // For example, if you need to access native dialogs or system notifications
    notifications: {
      // Example function to show native notifications
      showNotification: (title, body) => {
        new Notification(title, { body });
      }
    }
  }
);
