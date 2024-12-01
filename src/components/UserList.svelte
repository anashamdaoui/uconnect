<script lang="ts">
  import { jiraUsers, searchQuery, selectedUser, showResults } from '../stores/jiraStore';
  import type { JiraUser } from '../types/jira';

  $: filteredUsers = $jiraUsers.filter(user => 
    user.displayName.toLowerCase().includes($searchQuery.toLowerCase()) ||
    user.emailAddress.toLowerCase().includes($searchQuery.toLowerCase())
  );

  function selectUser(user: JiraUser) {
    selectedUser.set(user);
    searchQuery.set(user.displayName);
    showResults.set(false);
  }
</script>

{#if $showResults}
  <div class="user-list">
    {#if filteredUsers.length === 0}
      <div class="no-results">
        No contacts matched
      </div>
    {:else}
      {#each filteredUsers as user}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div 
          class="user-item"
          on:click={() => selectUser(user)}
          class:selected={$selectedUser?.accountId === user.accountId}
        >
          <div class="user-info">
            <div class="user-name">{user.displayName}</div>
            <div class="user-email">{user.emailAddress}</div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
{/if}

<!-- <style>
  .user-list {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #dfe1e6;
    border-radius: 3px;
    margin: 8px;
    background-color: white;
  }

  .user-item {
    padding: 12px;
    cursor: pointer;
    border-bottom: 1px solid #dfe1e6;
    transition: background-color 0.2s ease;
  }

  .user-item:last-child {
    border-bottom: none;
  }

  .user-item:hover {
    background-color: #f4f5f7;
  }

  .user-item.selected {
    background-color: #deebff;
  }

  .user-info {
    text-align: left;
  }

  .user-name {
    font-weight: 500;
    color: #172b4d;
    margin-bottom: 4px;
  }

  .user-email {
    font-size: 12px;
    color: #6b778c;
  }

  .no-results {
    padding: 16px;
    text-align: center;
    color: #6b778c;
    font-style: italic;
  }

  /* Scrollbar styling */
  .user-list::-webkit-scrollbar {
    width: 8px;
  }

  .user-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  .user-list::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  .user-list::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
</style> -->