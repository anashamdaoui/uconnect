export function toggleExtensionDisplay(show: boolean): void {
  const container = document.getElementById('uconnect-extension-root');
  if (container) {
    container.style.cssText = `display: ${show ? "flex" : "none"} !important;`;
  }
}

export function closeExtension(): void {
  chrome.runtime.sendMessage({ type: 'TOGGLE_EXTENSION', show: false });
  toggleExtensionDisplay(false);
}

export function toggleExtension(): void {
  const container = document.getElementById('uconnect-extension-root');
  const isCurrentlyVisible = container?.style.display !== 'none';
  const newState = !isCurrentlyVisible;
  
  chrome.runtime.sendMessage({ type: 'TOGGLE_EXTENSION', show: newState });
  toggleExtensionDisplay(newState);
}

export function togglePowerUPContainerDisplay(show: boolean): void {
  const container = document.getElementById('uconnect-power-up-container');
  if(container) {
    container.style.cssText = `display: ${show ? "block" : "none"} !important;`;
  }
}