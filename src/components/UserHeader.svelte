<script lang="ts">
  import { jiraSession } from '../stores/jiraStore';
</script>

<div class="user-header">
  {#if $jiraSession.currentUser}
    <!-- Cog Icon -->
		<button class="settings-icon">
      ⚙️
    </button>
    <div class="user-info">
      <span class="name">{$jiraSession.currentUser.displayName}</span>
      <span class="email">{$jiraSession.currentUser.emailAddress}</span>
    </div>
    <button class="logout-button">
      ⏻
    </button>
  {/if}
</div>

<!-- <style>
  .user-header {
    padding: 6px;
    background-color: #f5f5f5; /* Light gray background */
		border-bottom: 1px solid #e0e0e0; /* Subtle border */
    display: flex;
		justify-content: space-between;
		align-items: center;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .name {
    font-weight: 500;
    font-size: 16px;
  }

  .email {
    font-size: 12px;
    color: #6b778c;
  }

  .settings-icon{
    padding: 8px 16px;
    background-color: #E6E6E6;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .settings-icon:hover {
		background-color: #4caf50; /* Darker red on hover */
	}
  
	.logout-button {
		padding: 8px 16px;
    background-color: #E6E6E6;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.3s ease;
	}

	.logout-button:hover {
		background-color: #d32f2fed; /* Darker red on hover */
	}
</style> -->