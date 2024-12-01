import App from './App.svelte';
import './content.css';

// Create container for the extension
const container = document.createElement('div');
container.id = 'uconnect-extension-root';
document.body.appendChild(container);

// Initialize Svelte app
new App({
    target: container
});
