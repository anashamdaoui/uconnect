<script lang="ts">
    import { CallState } from "../../types/callState";
    import { searchQuery } from "../../stores/searchStore";
    import {
        currentState,
        isMuted,
        callDuration,
    } from "../../stores/callStateStore";
    import { formatDuration } from './utils';

    let intervalId: number;

    function expandToSearchMode() {
        currentState.set(CallState.Search);
    }

    function initiateCall() {
        currentState.set(CallState.Active);
        startCallDuration();
    }

    function endCall() {
        stopCallDuration();
        currentState.set(CallState.Compact);
        searchQuery.set("");
        isMuted.set(false);
    }

    function toggleMute() {
        isMuted.update((muted) => !muted);
    }

    function startCallDuration() {
        callDuration.set(0);
        intervalId = setInterval(() => {
            callDuration.update((duration) => duration + 1);
        }, 1000);
    }

    function stopCallDuration() {
        if (intervalId) {
            clearInterval(intervalId);
        }
    }
</script>

<div class="call-bar" class:compact={$currentState === CallState.Compact} class:expanded={$currentState !== CallState.Compact}>
    {#if $currentState === CallState.Compact}
        <button class="compact-button" on:click={expandToSearchMode}>✆</button>
    {:else if $currentState === CallState.Search}
        <input
            type="text"
            class="search-input"
            bind:value={$searchQuery}
            placeholder="Search contact"
        />
        <button class="call-button" on:click={initiateCall}>✆</button>
    {:else if $currentState === CallState.Active}
        <button class="hangup-button" on:click={endCall}>✆</button>
        <button
            class="mute-button"
            class:unmuted={!$isMuted}
            class:muted={$isMuted}
            on:click={toggleMute}
        >
            🎙️
        </button>
        <div class="duration">
            {formatDuration($callDuration)}
        </div>
    {/if}
</div>