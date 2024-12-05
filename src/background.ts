import { JIRA_ENDPOINTS, JIRA_BASE_URL } from './utils/jiraApi';
import { MessageTypes } from './utils/messageTypes';

// Session check interval (5 minutes)
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000;

let isContentDisplayed = false;

// Handle API requests through background script
async function handleApiRequest(endpoint: string, options: RequestInit = {}) {
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
async function checkJiraSession() {
  try {
    const userData = await handleApiRequest(JIRA_ENDPOINTS.myself);
    return { isLoggedIn: true, currentUser: userData };
  } catch (error) {
    return { isLoggedIn: false };
  }
}

// Set up periodic session checks
setInterval(async () => {
  const sessionStatus = await checkJiraSession();
  chrome.runtime.sendMessage({
    type: MessageTypes.SESSION_STATUS,
    payload: sessionStatus
  });
}, SESSION_CHECK_INTERVAL);

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Existing message handlers
  if (message.type === MessageTypes.API_REQUEST) {
    handleApiRequest(message.endpoint, message.options)
      .then(sendResponse)
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }

  if (message.type === MessageTypes.CHECK_SESSION) {
    checkJiraSession()
      .then(sendResponse)
      .catch(error => sendResponse({ error: error.message }));
    return true;
  }

  // New permission request handler
  if (message.type === MessageTypes.REQUEST_PERMISSION) {
    // Check if chrome.permissions is available
    if (chrome.permissions) {
      chrome.permissions.request(
        { origins: [`${message.url}/*`] },
        (granted) => {
          sendResponse({ granted: granted });
        }
      );
      return true; // Indicates we wish to send a response asynchronously
    } else {
      sendResponse({ 
        granted: false, 
        error: 'Permissions API not available' 
      });
      return false;
    }
  }

  // Existing toggle extension handler
  if (message.type === MessageTypes.TOGGLE_EXTENSION) {
    isContentDisplayed = message.show;
    // Broadcast the state change to all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, {
            type: MessageTypes.TOGGLE_EXTENSION,
            show: isContentDisplayed
          });
        }
      });
    });
  }

  // Handle cookie check request
  if (message.type === MessageTypes.CHECK_COOKIE) {
    try {
      chrome.cookies.get(
        {
          url: message.url,
          name: message.cookieName
        },
        (cookie) => {
          sendResponse({ 
            exists: !!cookie, 
            cookie: cookie 
          });
        }
      );
      return true; // Indicates asynchronous response
    } catch (error) {
      sendResponse({ 
        exists: false, 
        error: error instanceof Error ? error.message : String(error) 
      });
      return false;
    }
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  isContentDisplayed = !isContentDisplayed;
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id, {
      type: 'TOGGLE_EXTENSION',
      show: isContentDisplayed
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
});

// Initial session check
checkJiraSession();