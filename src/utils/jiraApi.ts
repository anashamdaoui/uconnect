const JIRA_BASE_URL = 'https://enreach-services.atlassian.net';

export async function fetchWithJiraSession(endpoint: string, options: RequestInit = {}) {
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
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

export const JIRA_ENDPOINTS = {
  myself: '/rest/api/2/myself',
  projectUsers: (projectKey: string) => `/rest/api/2/user/assignable/search?project=${projectKey}&maxResults=20`
};