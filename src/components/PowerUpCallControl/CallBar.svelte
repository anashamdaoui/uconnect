<script lang="ts">
    import { CallState } from "../../types/callState";
    import { searchQuery } from "../../stores/searchStore";
    import {
        currentState,
        isMuted,
        callDuration,
    } from "../../stores/callStateStore";
    import { formatDuration } from "./utils";

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

<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
    <!-- Unmuted Microphone Icon -->
    <symbol
        id="microphone-unmuted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="22"></line>
        <line x1="8" y1="22" x2="16" y2="22"></line>
    </symbol>

    <!-- Muted Microphone Icon -->
    <symbol
        id="microphone-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <line x1="1" y1="1" x2="23" y2="23"></line>
        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
        <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
        <line x1="12" y1="19" x2="12" y2="22"></line>
        <line x1="8" y1="22" x2="16" y2="22"></line>
    </symbol>
</svg>

<div
    class="call-bar"
    class:compact={$currentState === CallState.Compact}
    class:expanded={$currentState !== CallState.Compact}
>
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
            <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                {#if $isMuted}
                    <use href="#microphone-muted" />
                {:else}
                    <use href="#microphone-unmuted" />
                {/if}
            </svg>
        </button>
        <div class="duration">
            {formatDuration($callDuration)}
        </div>
    {/if}
</div>
