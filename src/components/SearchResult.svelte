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
          <div class="user-details">
            <div class="user-name">{user.displayName}</div>
            <div class="user-email">{user.emailAddress}</div>
          </div>
        </div>
      {/each}
    {/if}
  </div>
{/if}
