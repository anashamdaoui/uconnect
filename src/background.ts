import { JIRA_ENDPOINTS } from './utils/jiraApi';
import {MessageTypes} from './utils/messageTypes';

/*// Message types
const MessageTypes = {
  API_REQUEST: 'API_REQUEST',
  CHECK_SESSION: 'CHECK_SESSION',
  SESSION_STATUS: 'SESSION_STATUS'
} as const;
*/

// Session check interval (5 minutes)
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000;

// Handle API requests through background script
async function handleApiRequest(endpoint: string, options: RequestInit = {}) {
  const JIRA_BASE_URL = 'https://enreach-services.atlassian.net';
  
  try {
    const response = await fetch(`${JIRA_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Check Jira session
async function checkSession() {
  try {
    const userData = await handleApiRequest(JIRA_ENDPOINTS.myself);
    return { isLoggedIn: true, currentUser: userData };
  } catch (error) {
    return { isLoggedIn: false };
  }
}

// Set up periodic session checks
setInterval(async () => {
  const sessionStatus = await checkSession();
  chrome.runtime.sendMessage({
    type: MessageTypes.SESSION_STATUS,
    payload: sessionStatus
  });
}, SESSION_CHECK_INTERVAL);

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === MessageTypes.API_REQUEST) {
    handleApiRequest(message.endpoint, message.options)
      .then(sendResponse)
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }
  
  if (message.type === MessageTypes.CHECK_SESSION) {
    checkSession()
      .then(sendResponse)
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }
});

// Initial session check
checkSession();

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
});