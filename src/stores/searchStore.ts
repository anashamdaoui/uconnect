import { writable } from 'svelte/store';

export const searchQuery = writable<string>('');

// Derived store to determine if search results should be shown
export const showResults = writable<boolean>(false);