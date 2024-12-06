<script lang="ts">
    import { fly } from "svelte/transition";
    import DraggableContainer from './DraggableContainer.svelte';
    import CallBar from './CallBar.svelte';
</script>

<div transition:fly={{ y: 50, duration: 300 }}>
    <DraggableContainer>
        <CallBar />
    </DraggableContainer>
</div>