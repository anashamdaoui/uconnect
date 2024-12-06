<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import type { Position } from '../../types/position';
    import { savePosition, loadPosition } from './utils';
    import { currentState } from "../../stores/callStateStore";
    import { CallState } from "../../types/callState";

    export let defaultPosition: Position = {
        x: Math.max(0, window.innerWidth - 60),
        y: Math.max(0, window.innerHeight - 100)
    };

    let isDragging = false;
    let startX: number, startY: number;
    let offsetX: number = defaultPosition.x;
    let offsetY: number = defaultPosition.y;
    let containerElement: HTMLDivElement;

    function startDrag(e: MouseEvent) {
        isDragging = true;
        const rect = containerElement.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        
        document.addEventListener("mousemove", handleDrag);
        document.addEventListener("mouseup", stopDrag);
    }

    function handleDrag(e: MouseEvent) {
        if (!isDragging) return;

        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;

        const elementWidth = containerElement.offsetWidth;
        const elementHeight = containerElement.offsetHeight;

        offsetX = Math.max(0, Math.min(offsetX, window.innerWidth - elementWidth));
        offsetY = Math.max(0, Math.min(offsetY, window.innerHeight - elementHeight));

        containerElement.style.cssText = `
            position: fixed !important;
            left: ${offsetX}px !important;
            top: ${offsetY}px !important;
            transform: translateX(${$currentState === CallState.Compact ? '0' : '-100%'}) !important;
        `;
    }

    function stopDrag() {
        if (!isDragging) return;
        
        isDragging = false;
        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("mouseup", stopDrag);
        savePosition({ x: offsetX, y: offsetY });
    }

    function handleKeyboardDrag(e: KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            // TODO: Implement keyboard navigation
        }
    }

    let resizeListener = () => {
        if (containerElement) {
            offsetX = Math.max(0, Math.min(offsetX, window.innerWidth - containerElement.offsetWidth));
            offsetY = Math.max(0, Math.min(offsetY, window.innerHeight - containerElement.offsetHeight));
            containerElement.style.cssText = `
                position: fixed !important;
                left: ${offsetX}px !important;
                top: ${offsetY}px !important;
                transform: translateX(${$currentState === CallState.Compact ? '0' : '-100%'}) !important;
            `;
        }
    };

    onMount(() => {
        const savedPosition = loadPosition();
        if (savedPosition) {
            offsetX = savedPosition.x;
            offsetY = savedPosition.y;
        }
        window.addEventListener("resize", resizeListener);
        
        // Set initial position
        if (containerElement) {
            containerElement.style.cssText = `
                position: fixed !important;
                left: ${offsetX}px !important;
                top: ${offsetY}px !important;
                transform: translateX(${$currentState === CallState.Compact ? '0' : '-100%'}) !important;
            `;
        }
    });

    onDestroy(() => {
        window.removeEventListener("resize", resizeListener);
    });

    $: if (containerElement && $currentState !== undefined) {
        containerElement.style.transform = `translateX(${$currentState === CallState.Compact ? '0' : '-100%'})`;
    }
</script>

<div
    bind:this={containerElement}
    class="uconnect-power-up-container"
    on:mousedown={startDrag}
    role="button"
    tabindex="0"
    aria-label="Drag Power-Up Call Control"
>
    <div
        role="button"
        tabindex="0"
        aria-label="Drag handle"
        class="drag-handle"
        on:mousedown={startDrag}
        on:keydown={handleKeyboardDrag}
    ></div>
    <slot />
</div>