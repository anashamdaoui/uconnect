<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { formatPhoneNumber } from "../utils/phoneNumberUtils";

    export let phoneNumber: string;
    export let x: number = 0;
    export let y: number = 0;

    const dispatch = createEventDispatcher();

    function handleCall() {
        dispatch("call", { phoneNumber });
    }

    function handleCopy() {
        navigator.clipboard.writeText(phoneNumber);
        dispatch("copy", { phoneNumber });
    }

    function handleChat() {
        navigator.clipboard.writeText(phoneNumber);
        dispatch("chat", { phoneNumber });
    }

    // Format the phone number for display
    $: formattedNumber = formatPhoneNumber(phoneNumber);
</script>

<div class="uconnect-phone-context-menu" style="left: {x}px; top: {y}px;">
    <div class="phone-number">{formattedNumber}</div>
    <div class="phone-menu-items">
        <button class="menu-item" on:click={handleCall}>📞 </button>
        <button class="menu-item" on:click={handleCopy}>📋 </button>
        <button class="menu-item" on:click={handleChat}>💬 </button>
    </div>
</div>

<style>
    .uconnect-phone-context-menu {
        position: fixed;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 8px;
        z-index: 2147483647;
        min-width: 150px;
    }

    .phone-number {
        font-size: 14px;
        padding: 4px 8px;
        border-bottom: 1px solid #eee;
        margin-bottom: 4px;
        color: #333;
    }

    .phone-menu-items {
        display: flex;
        gap: 10px;
        justify-content: center;
        align-items: center;
    }

    .menu-item {
        display: block;
        width: 100%;
        padding: 6px 8px;
        border: none;
        background: none;
        text-align: left;
        cursor: pointer;
        font-size: 14px;
        color: #333;
    }

    .menu-item:hover {
        background: #f5f5f5;
    }
</style>
