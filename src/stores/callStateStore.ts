import { writable } from "svelte/store";
import { CallState } from "../types/callState";

// Writable stores for state management
export const currentState = writable<CallState>(CallState.Compact);
export const callDuration = writable<number>(0);
export const isMuted = writable<boolean>(false);
