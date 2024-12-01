<script lang="ts">
  import { onMount } from "svelte";
  import { jiraSession } from "./stores/jiraStore";
  import {
    checkJiraSession,
    fetchProjectUsers,
    redirectToJiraLogin,
  } from "./services/jiraService";
  import UserHeader from "./components/UserHeader.svelte";
  import SearchBar from "./components/SearchBar.svelte";
  import UserList from "./components/UserList.svelte";

  let error = null;

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
    <UserHeader />
    <SearchBar />
    <UserList />
  {:else}
    <div class="login-prompt">
      <p>You are not connected to JIRA</p>
      <button on:click={redirectToJiraLogin}>Connect to Jira</button>
    </div>
  {/if}
</div>

<style>
  .uconnect-container {
    width: 100%;
    background: white;
    border-radius: 8px;
    overflow: hidden;
  }

  .login-prompt {
    padding: 20px;
    text-align: center;
  }

  .login-prompt button {
    margin-top: 12px;
    padding: 8px 16px;
    background-color: #0052cc;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
</style>
