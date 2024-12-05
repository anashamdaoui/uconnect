<script lang="ts">
  import { onMount } from "svelte";
  import { jiraSession } from "./stores/jiraStore";
  import {
    checkJiraSession,
    fetchProjectUsers,
    redirectToJiraLogin,
  } from "./services/jiraService";
  import SideBar from "./components/SideBar.svelte";
  import HeaderBar from "./components/HeaderBar.svelte";
  import SearchBar from "./components/SearchBar.svelte";
  import SearchResult from "./components/SearchResult.svelte";
  import SettingsForm from "./components/SettingsForm.svelte";
  import { get } from 'svelte/store';
  import { settingsStore } from './stores/settingsStore';
  import { currentView } from './stores/viewStore';

  let error = null;
  // Subscribe to the settings store
  let settings = get(settingsStore);
  let telephonyServer = settings.telephonyServer;

  try {
    console.log("App started");

    onMount(async () => {
      const isLoggedIn = await checkJiraSession();
      if (isLoggedIn) {
        fetchProjectUsers();
      }
    });
  } catch (err) {
    error = err;
    console.error("Error loading the app:", err);
  }
</script>

<div class="uconnect-container">
  {#if $jiraSession.isLoggedIn}
    <SideBar />
    <main class="main-content">
      <HeaderBar />
      {#if $currentView === "search"}
        <SearchBar />
        <SearchResult />
      {:else if $currentView === "settings"}
        <SettingsForm />
      {/if}
    </main>
  {:else}
    <div class="login-prompt">
      <p>You are not connected to JIRA</p>
      <button on:click={redirectToJiraLogin}>Connect to Jira</button>
    </div>
  {/if}
</div>
