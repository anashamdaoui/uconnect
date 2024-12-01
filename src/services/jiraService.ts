import type { JiraUser } from '../types/jira';
import { jiraSession, jiraUsers } from '../stores/jiraStore';
import { fetchWithJiraSession, JIRA_ENDPOINTS } from '../utils/jiraApi';

const JIRA_BASE_URL = 'https://enreach-services.atlassian.net';
const PROJECT_KEY = 'ICP';

export async function checkJiraSession(): Promise<boolean> {
  try {
    const userData = await fetchWithJiraSession(JIRA_ENDPOINTS.myself);
    jiraSession.set({
      isLoggedIn: true,
      currentUser: userData
    });
    return true;
  } catch (error) {
    jiraSession.set({ isLoggedIn: false });
    return false;
  }
}

export async function fetchProjectUsers(): Promise<void> {
  try {
    const users: JiraUser[] = await fetchWithJiraSession(
      JIRA_ENDPOINTS.projectUsers(PROJECT_KEY)
    );
    jiraUsers.set(users);
  } catch (error) {
    console.error('Error fetching project users:', error);
    jiraUsers.set([]);
  }
}

export function redirectToJiraLogin(): void {
  chrome.tabs.create({ url: JIRA_BASE_URL });
}