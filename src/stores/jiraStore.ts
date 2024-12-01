import { writable } from 'svelte/store';
import type { JiraUser, JiraSession } from '../types/jira';

export const jiraSession = writable<JiraSession>({
  isLoggedIn: false
});

export const jiraUsers = writable<JiraUser[]>([]);

export const searchQuery = writable<string>('');
export const selectedUser = writable<JiraUser | null>(null);

// Derived store to determine if search results should be shown
export const showResults = writable<boolean>(false);