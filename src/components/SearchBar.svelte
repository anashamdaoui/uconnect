<script lang="ts">
  import { searchQuery, selectedUser, showResults } from '../stores/jiraStore';
  
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    searchQuery.set(value);
    showResults.set(value.length > 0);
  }

  function handleBlur() {
    // Small delay to allow click events on the user list to fire
    setTimeout(() => {
      showResults.set(false);
    }, 200);
  }

  function handleFocus() {
    if ($searchQuery.length > 0) {
      showResults.set(true);
    }
  }
</script>

<div class="search-container">
  <input
    type="text"
    placeholder="Search users..."
    value={$searchQuery}
    on:input={handleInput}
    on:blur={handleBlur}
    on:focus={handleFocus}
    class="search-input"
  />
  <button class="call-button" disabled={!$selectedUser}>
  📞 
  </button>
</div>
<!--
<style>
  .search-container {
    display: flex;
    gap: 8px;
    padding: 8px;
  }

  .search-input {
    flex: 1;
    padding: 8px;
    border: 1px solid #dfe1e6;
    border-radius: 20px;
    font-size: 14px;
    outline: none;
  }

  .call-button {
    padding: 8px 16px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .call-button:disabled {
    background-color: #E6E6E6;
    cursor: not-allowed;
  }
</style>
-->