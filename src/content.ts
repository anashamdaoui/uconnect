import App from './App.svelte';
import './content.css';

let container: HTMLElement | null = null;

// Listen for toggle messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TOGGLE_EXTENSION') {
    if (message.show) {
      if (!container) {
        // Create container and initialize app if not already created
        container = document.createElement('div');
        container.id = 'uconnect-extension-root';
        document.body.appendChild(container);

        new App({
          target: container,
        });
      } else {
        // Show the container
        container.style.display = 'block';
      }
    } else {
      if (container) {
        // Hide the container
        container.style.display = 'none';
      }
    }
  }
});
