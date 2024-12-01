import type { ChromeMessage } from './messageTypes';

export function sendChromeMessage<T = any>(message: ChromeMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}

export function addChromeMessageListener(callback: (message: ChromeMessage) => void) {
  chrome.runtime.onMessage.addListener((message: ChromeMessage) => {
    callback(message);
  });
}