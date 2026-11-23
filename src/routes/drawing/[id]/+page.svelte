<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { db } from '$lib/db';
	import type { Drawing, PaletteSet, Stage } from '$lib/types';
	import Timeline from '$lib/components/Timeline.svelte';
	import CompareSlider from '$lib/components/CompareSlider.svelte';
	import SideBySideCompare from '$lib/components/SideBySideCompare.svelte';
	import PaletteStrip from '$lib/components/PaletteStrip.svelte';
	import { exportGif } from '$lib/export/gif';
	import { exportDrawingData } from '$lib/export/drawing';

	let drawing = $state<Drawing>();
	let stages = $state<Stage[]>([]);
	let urls = $state<Record<string, string>>({});
	let selected = $state('');
	let compareLeftId = $state('');
	let compareRightId = $state('');
	let compareMode = $state<'slider' | 'side'>('slider');
	let labelDraft = $state('');
	let paletteSet = $state<PaletteSet>();
	let paletteSets = $state<PaletteSet[]>([]);
	let busy = $state(false);
	let delay = $state(600);
	let loadError = $state('');
	let actionError = $state('');
	let status = $state('');

	const current = $derived(stages.find((stage) => stage.id === selected));
	const compareLeft = $derived(stages.find((stage) => stage.id === compareLeftId));
	const compareRight = $derived(stages.find((stage) => stage.id === compareRightId));

	$effect(() => {
		labelDraft = current?.label ?? '';
	});

	async function refresh() {
		const id = page.params.id;
		if (!id) {
			loadError = 'This drawing could not be found.';
			return;
		}

		const drawingRecord = await db.drawings.get(id);
		if (!drawingRecord) {
			loadError = 'This drawing could not be found.';
			return;
		}

		drawing = drawingRecord;
		stages = await db.stages.where('drawingId').equals(id).sortBy('createdAt');
		paletteSets = await db.paletteSets.toArray();
		paletteSet = drawing.paletteSetId ? await db.paletteSets.get(drawing.paletteSetId) : undefined;

		if (!stages.some((stage) => stage.id === selected)) selected = stages.at(-1)?.id ?? '';
		if (!stages.some((stage) => stage.id === compareLeftId)) compareLeftId = stages[0]?.id ?? '';
		if (!stages.some((stage) => stage.id === compareRightId)) compareRightId = stages.at(-1)?.id ?? '';

		for (const url of Object.values(urls)) URL.revokeObjectURL(url);
		urls = Object.fromEntries(stages.map((stage) => [stage.id, URL.createObjectURL(stage.flatBlob)]));
	}

	onMount(() => {
		void refresh().catch((error: unknown) => {
			loadError = error instanceof Error ? error.message : 'Could not load this drawing.';
		});
		return () => Object.values(urls).forEach(URL.revokeObjectURL);
	});

	async function deleteStage(stage: Stage) {
		if (!confirm('Delete this stage?')) return;
		await db.stages.delete(stage.id);
		await refresh();
	}

	async function saveLabel(event: SubmitEvent) {
		event.preventDefault();
		if (!current) return;
		const label = labelDraft.trim();
		try {
			await db.stages.update(current.id, { label: label || undefined });
			stages = stages.map((stage) => stage.id === current.id ? { ...stage, label: label || undefined } : stage);
			labelDraft = label;
			status = label ? 'Stage label saved.' : 'Stage label cleared.';
			actionError = '';
		} catch (error) {
			actionError = error instanceof Error ? error.message : 'Could not save this label.';
			status = '';
		}
	}

	async function selectPaletteSet(id: string) {
		if (!drawing) return;
		await db.drawings.update(drawing.id, { paletteSetId: id || undefined });
		drawing = { ...drawing, paletteSetId: id || undefined };
		paletteSet = paletteSets.find((set) => set.id === id);
	}

	async function makeGif() {
		if (stages.length < 2) return;
		busy = true;
		actionError = '';
		status = '';
		try {
			const blob = await exportGif(stages, delay);
			const url = URL.createObjectURL(blob);
			const anchor = document.createElement('a');
			anchor.href = url;
			anchor.download = `${drawing?.title ?? 'skepanion'}.gif`;
			anchor.click();
			setTimeout(() => URL.revokeObjectURL(url), 1000);
			status = 'Progress GIF downloaded.';
		} catch (error) {
			actionError = error instanceof Error ? error.message : 'GIF export failed.';
		} finally {
			busy = false;
		}
	}

	async function exportOneDrawing() {
		if (!drawing) return;
		busy = true;
		actionError = '';
		status = '';
		try {
			const blob = await exportDrawingData(drawing, stages, paletteSet);
			const url = URL.createObjectURL(blob);
			const anchor = document.createElement('a');
			anchor.href = url;
			anchor.download = `${drawing.title.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'drawing'}-skepanion.json`;
			anchor.click();
			setTimeout(() => URL.revokeObjectURL(url), 1000);
			status = 'Drawing export downloaded.';
		} catch (error) {
			actionError = error instanceof Error ? error.message : 'Drawing export failed.';
		} finally {
			busy = false;
		}
	}

	function stageName(stage: Stage): string {
		const index = stages.findIndex((item) => item.id === stage.id) + 1;
		return stage.label?.trim() || `Stage ${index}`;
	}

	function stageOption(stage: Stage): string {
		return `${stageName(stage)} · ${new Date(stage.createdAt).toLocaleDateString()}`;
	}
</script>

<div class="app drawing-page">
	<header class="topbar">
		<a class="brand" href={`${base}/`}><span class="brand-mark">✳</span>Skepanion</a>
		<nav class="nav"><a href={`${base}/palettes`}>My colors</a><a href={`${base}/monthly`}>Monthly</a><a href={`${base}/backup`}>Backup</a></nav>
	</header>

	{#if loadError}
		<div class="card">{loadError} <a href={`${base}/`}>Back to drawings</a></div>
	{:else if drawing}
		<a href={`${base}/`} class="muted back-link">← All drawings</a>
		<div class="row page-title-row" style="justify-content:space-between">
			<div><p class="eyebrow">Drawing timeline</p><h1>{drawing.title}</h1></div>
			<a class="button" href={`${base}/drawing/${drawing.id}/add`}>＋ Add stage</a>
		</div>

		<section class="section progress-section">
			<div class="row section-heading"><h2>Progress</h2>{#if stages.length}<span class="stage-count">{stages.length} {stages.length === 1 ? 'stage' : 'stages'}</span>{/if}</div>
			{#if stages.length === 0}
				<div class="card empty-card"><div class="empty-mark" aria-hidden="true">✳</div><h2>Add your first photo</h2><p class="muted">A simple, repeatable photo makes it easier to see your progress.</p><a class="button" href={`${base}/drawing/${drawing.id}/add`}>Add a stage</a></div>
			{:else}
				<Timeline {stages} {urls} bind:selected />
				{#if current}
					<div class="card selected-stage-panel">
						<form class="stage-label-form" onsubmit={saveLabel}>
							<div class="stage-label-copy"><p class="eyebrow">Selected stage</p><p>{new Date(current.createdAt).toLocaleDateString()}</p></div>
							<label class="field stage-label-field" for="stage-label">Stage label<input id="stage-label" bind:value={labelDraft} maxlength="40" placeholder={stageName(current)} /></label>
							<button class="button secondary" type="submit">Save label</button>
						</form>
					</div>
				{/if}

				{#if stages.length > 1}
					<div class="compare-toolbar">
						<label class="field"><span>Compare</span><select bind:value={compareLeftId}>{#each stages as stage}<option value={stage.id}>{stageOption(stage)}</option>{/each}</select></label>
						<span class="compare-separator" aria-hidden="true">with</span>
						<label class="field"><span>And</span><select bind:value={compareRightId}>{#each stages as stage}<option value={stage.id}>{stageOption(stage)}</option>{/each}</select></label>
						<div class="segmented" role="group" aria-label="Comparison layout">
							<button class:active={compareMode === 'slider'} aria-pressed={compareMode === 'slider'} onclick={() => compareMode = 'slider'}>Slider</button>
							<button class:active={compareMode === 'side'} aria-pressed={compareMode === 'side'} onclick={() => compareMode = 'side'}>Side by side</button>
						</div>
					</div>
					<div class="card compare-card">
						{#if compareLeft && compareRight}
							{#if compareMode === 'slider'}
								<CompareSlider before={urls[compareLeft.id]} after={urls[compareRight.id]} label={`Compare ${stageName(compareLeft)} with ${stageName(compareRight)}`} />
							{:else}
								<SideBySideCompare leftImage={urls[compareLeft.id]} rightImage={urls[compareRight.id]} leftLabel={stageOption(compareLeft)} rightLabel={stageOption(compareRight)} />
							{/if}
						{/if}
					</div>
				{:else if current}
					<div class="card compare-card"><img src={urls[current.id]} alt={`${stageName(current)} drawing stage`} class="single-stage-image" /></div>
				{/if}

				<div class="row stage-actions">
					<label class="field gif-delay-field">GIF frame delay<select bind:value={delay}><option value={300}>300 ms</option><option value={600}>600 ms</option><option value={1000}>1000 ms</option></select></label>
					<button class="button secondary" disabled={stages.length < 2 || busy} onclick={() => void makeGif()}>{busy ? 'Preparing export…' : '↓ Export progress GIF'}</button>
					<button class="button secondary" disabled={busy} onclick={() => void exportOneDrawing()}>{busy ? 'Preparing export…' : '↓ Export this drawing'}</button>
					{#if current}<button class="button danger" onclick={() => void deleteStage(current)}>Delete selected stage</button>{/if}
				</div>
				{#if status}<p class="success-message" role="status">{status}</p>{/if}
				{#if actionError}<p class="form-error" role="alert">{actionError}</p>{/if}
			{/if}
		</section>

		{#if stages.length}
			<section class="section palette-section">
				<div class="row palette-heading" style="justify-content:space-between">
					<div><p class="eyebrow">The color story</p><h2>Colors over time</h2></div>
					{#if paletteSets.length}
						<label class="field palette-select"><span>Mixing suggestions use</span><select value={drawing.paletteSetId ?? ''} onchange={(event) => void selectPaletteSet(event.currentTarget.value)}><option value="">No color set</option>{#each paletteSets as set}<option value={set.id}>{set.name}</option>{/each}</select></label>
					{/if}
				</div>
				{#each stages as stage, index}
					<article class="card palette-stage">
						<div class="row stage-meta" style="justify-content:space-between"><div><p class="eyebrow">{stageName(stage)}</p><b>{new Date(stage.createdAt).toLocaleDateString()}</b></div>{#if stage.note}<span class="muted">{stage.note}</span>{/if}</div>
						<div class="palette-stage-content"><PaletteStrip palette={stage.palette} paletteSet={paletteSet} /></div>
					</article>
				{/each}
			</section>
		{/if}
	{/if}
</div>
