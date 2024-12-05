<script lang="ts">
    import { currentView } from "../stores/viewStore";
    import { closeExtension } from "../utils/extensionUtils";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    function handleButtonClick(view: string) {
        currentView.set(view);
    }

    function handleCloseExtension() {
        closeExtension();
    }
</script>

<div class="sidebar">
    <div class="sidebar-header">
        <button
            class="sidebar-btn close-btn"
            on:click={handleCloseExtension}
            title="Close Sidebar"
        >
            ⨉
        </button>
    </div>

    <div class="sidebar-scroll-view">
        <button
            class="sidebar-btn"
            on:click={() => handleButtonClick("search")}
            title="Search"
        >
            🔍
        </button>
        <button
            class="sidebar-btn"
            on:click={() => handleButtonClick("chat")}
            title="Chat"
        >
            💬
        </button>
        <button
            class="sidebar-btn"
            on:click={() => handleButtonClick("calendar")}
            title="Calendar"
        >
            🗓️
        </button>
        <button
            class="sidebar-btn"
            on:click={() => handleButtonClick("history")}
            title="History"
        >
            🕘
        </button>
    </div>

    <div class="sidebar-footer">
        <button
            class="sidebar-btn"
            on:click={() => handleButtonClick("help")}
            title="Help"
        >
            ❔
        </button>
        <button
            class="sidebar-btn"
            on:click={() => handleButtonClick("settings")}
            title="Settings"
        >
            ⚙️
        </button>
        <button class="sidebar-btn logout-btn" title="Logout">
            🔓
        </button>
    </div>
</div>