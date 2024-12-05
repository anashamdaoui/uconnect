<script lang="ts">
  import { jiraSession } from "../stores/jiraStore";
</script>

<div class="header-bar">
  {#if $jiraSession.currentUser}
    <div class="user-details">
      <span class="name">{$jiraSession.currentUser.displayName}</span>
      <span class="email">{$jiraSession.currentUser.emailAddress}</span>
    </div>
  {/if}
</div>
