import App from '../App.svelte';
import { toggleExtensionDisplay, togglePowerUPContainerDisplay } from '../utils/extensionUtils';
import { setupPhoneNumberHighlighter, cleanupPhoneNumberHighlighter } from './phoneNumberHighlighter';
import PowerUpCallControl from '../components/PowerUpCallControl/index.svelte';
import { settingsStore } from '../stores/settingsStore';
import '../app.css';

let app: App | null = null;
let container: HTMLElement | null = null;
let powerUpCallControl: PowerUpCallControl | null = null;
let powerUpContainer: HTMLElement | null = null;
let settingsUnsubscribe: (() => void) | null = null;

function initializeExtension() {
    // Create container if it doesn't exist
    if (!container) {
        container = document.createElement('div');
        container.id = 'uconnect-extension-root';
        container.style.cssText = 'display: none !important;';
        document.body.appendChild(container);

        // Initialize Svelte app
        app = new App({
            target: container,
        });
    }

    // Create PowerUp Call Control container
    if (!powerUpContainer) {
        powerUpContainer = document.createElement('div');
        powerUpContainer.id = 'uconnect-power-up-call-control';
        powerUpContainer.style.cssText = `
            position: fixed !important;
            z-index: 2147483647 !important;
            display: block !important;
        `;

        document.body.appendChild(powerUpContainer);

        // Initialize PowerUp Call Control
        powerUpCallControl = new PowerUpCallControl({
            target: powerUpContainer,
        });
    }

    // Subscribe to settings changes
    settingsUnsubscribe = settingsStore.subscribe(settings => {
        if (powerUpContainer) {
            powerUpContainer.style.cssText = `
                position: fixed !important;
                z-index: 2147483647 !important;
                display: ${settings.powerUpEnabled ? "block" : "none"} !important;
            `;
        }
    });

    // Initialize phone number detection
    setupPhoneNumberHighlighter();
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
            togglePowerUPContainerDisplay(false);
        }
    }
});

// Cleanup when the extension is unloaded
window.addEventListener('unload', () => {
    if (settingsUnsubscribe) {
        settingsUnsubscribe();
    }

    cleanupPhoneNumberHighlighter();

    if (app) {
        app.$destroy();
        app = null;
    }

    if (powerUpCallControl) {
        powerUpCallControl.$destroy();
        powerUpCallControl = null;
    }

    if (container) {
        document.body.removeChild(container);
        container = null;
    }

    if (powerUpContainer) {
        document.body.removeChild(powerUpContainer);
        powerUpContainer = null;
    }
});

// Initialize extension on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
    initializeExtension();
}