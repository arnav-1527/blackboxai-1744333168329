/**
 * macOS Integration Script
 * Enhances web application with macOS-specific features
 */

// Check if running in Electron environment
const isElectron = window.electron !== undefined;

function queueNotification(message) {
    // Use native notifications
    if (window.electron && window.electron.notifications) {
        window.electron.notifications.showNotification('MedTrack Alert', message);
    } else {
        // Fallback to alert if notifications are not available
        alert(message);
    }
}

// Initialize macOS integration
document.addEventListener('DOMContentLoaded', () => {
  if (!isElectron) return;
  
  console.log('Initializing macOS integration...');
  
  // Get app info
  const { appInfo, notifications } = window.electron;
  console.log(`Running ${appInfo.name} v${appInfo.version} on ${appInfo.platform}`);
  
  // Add macOS-specific CSS classes to enable native styling
  document.body.classList.add('macos-app');
  
  // Override alert with native notifications on macOS
  if (appInfo.platform === 'darwin') {
    // Store the original alert function
    const originalAlert = window.alert;
    
    // Override with native notifications
    window.alert = (message) => {
      // Use native notifications
      notifications.showNotification('MedTrack Alert', message);
      
      // Also call the original for compatibility
      originalAlert(message);
    };
    
    console.log('Native notifications enabled');
  }

  // Add macOS-specific keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Command+Q to quit (handled by Electron)
    // Command+F to search
    if (e.metaKey && e.key === 'f') {
      e.preventDefault();
      const searchInput = document.getElementById('searchMedicine');
      if (searchInput) {
        searchInput.focus();
      }
    }
    
    // Command+R to refresh data
    if (e.metaKey && e.key === 'r') {
      e.preventDefault();
      const refreshBtn = document.getElementById('refreshBtn');
      if (refreshBtn) {
        refreshBtn.click();
      }
    }
  });
  
  // Enhance the UI with macOS-specific styling
  enhanceMacOSStyling();
});

// Add macOS-specific styling enhancements
function enhanceMacOSStyling() {
  // Add a small style element for macOS-specific adjustments
  const style = document.createElement('style');
  style.textContent = `
    /* macOS-specific adjustments */
    .macos-app button {
      backdrop-filter: blur(20px);
    }
    
    .macos-app input, .macos-app select {
      border-radius: 6px;
    }
    
    /* Better scrollbar for macOS */
    .macos-app ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    .macos-app ::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05);
      border-radius: 8px;
    }
    
    .macos-app ::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
    }
    
    .macos-app ::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  `;
  
  document.head.appendChild(style);
  console.log('macOS styling enhancements applied');
}
