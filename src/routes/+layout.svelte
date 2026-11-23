<script lang="ts">import { base } from '$app/paths'; import '../app.css'; let { children } = $props();</script>
<svelte:head><title>Skepanion · Your sketchbook companion</title><meta name="description" content="Track drawing progress and the colors you use, all on your device."/><link rel="icon" href={`${base}/icon.svg`}/></svelte:head>
{@render children()}
