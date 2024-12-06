<script lang="ts">
  import { selectedUser } from '../stores/jiraStore';
  import { searchQuery, showResults } from '../stores/searchStore';
  
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
    bind:value={$searchQuery}
    on:input={handleInput}
    on:blur={handleBlur}
    on:focus={handleFocus}
    class="search-input"
  />
  <button class="call-button" disabled={!$selectedUser}>
  📞 
  </button>
</div>
