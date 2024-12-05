import App from './App.svelte';
import { toggleExtensionDisplay } from './utils/extensionUtils';
import { setupPhoneNumberHighlighter, cleanupPhoneNumberHighlighter } from './content/phoneNumberHighlighter';
import './app.css';

let app: App | null = null;
let container: HTMLElement | null = null;

function initializeExtension() {
  // Create container if it doesn't exist
  if (!container) {
    container = document.createElement('div');
    container.id = 'uconnect-extension-root';
    container.style.display = 'none'; // Initially hidden
    document.body.appendChild(container);

    // Initialize Svelte app
    app = new App({
      target: container,
    });
  }

  // Initialize phone number detection
  setupPhoneNumberHighlighter();
}

// Initialize extension on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
  initializeExtension();
}

// Listen for toggle messages from the background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TOGGLE_EXTENSION') {
    if (message.show) {
      if (!container) {
        initializeExtension();
      }
      toggleExtensionDisplay(true);
    } else {
      toggleExtensionDisplay(false);
    }
  }
});

// Cleanup when the extension is unloaded
window.addEventListener('unload', () => {
  cleanupPhoneNumberHighlighter();
});