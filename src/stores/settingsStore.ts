import { writable } from 'svelte/store';

export interface Settings {
  telephonyServer: string;
  crmURL: string;
  calendarURL: string;
  language: string;
  appearance: string;
  textSize: string;
  shortcutKey: string;
  sidebarPosition: string;
  powerUpEnabled: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  telephonyServer: "",
  crmURL: "",
  calendarURL: "",
  language: "English",
  appearance: "Follow system",
  textSize: "Normal",
  shortcutKey: "",
  sidebarPosition: "Top Right",
  powerUpEnabled: false,
};

function createSettingsStore() {
  // Load settings from localStorage or use defaults
  const storedSettings = localStorage.getItem("userSettings");
  const initialSettings = storedSettings ? JSON.parse(storedSettings) : DEFAULT_SETTINGS;
  
  const { subscribe, set, update } = writable<Settings>(initialSettings);

  return {
    subscribe,
    set: (settings: Settings) => {
      localStorage.setItem("userSettings", JSON.stringify(settings));
      set(settings);
    },
    update,
    reset: () => {
      localStorage.setItem("userSettings", JSON.stringify(DEFAULT_SETTINGS));
      set(DEFAULT_SETTINGS);
    }
  };
}

export const settingsStore = createSettingsStore();