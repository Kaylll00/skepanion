<script lang="ts">
	let {
		leftImage,
		rightImage,
		leftLabel,
		rightLabel
	}: { leftImage: string; rightImage: string; leftLabel: string; rightLabel: string } = $props();
</script>

<div class="side-by-side" aria-label="Side-by-side stage comparison">
	<figure>
		<img src={leftImage} alt={`Earlier stage: ${leftLabel}`} />
		<figcaption>{leftLabel}</figcaption>
	</figure>
	<figure>
		<img src={rightImage} alt={`Later stage: ${rightLabel}`} />
		<figcaption>{rightLabel}</figcaption>
	</figure>
</div>

<style>
	.side-by-side { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
	figure { min-width: 0; margin: 0; overflow: hidden; border: 1px solid #e5e9e1; border-radius: 15px; background: #f5f5f0; }
	img { display: block; width: 100%; aspect-ratio: 3 / 4; object-fit: contain; }
	figcaption { overflow: hidden; padding: 10px 12px; border-top: 1px solid #e7ebe4; background: #fffefa; color: #42584c; font-size: 12px; font-weight: 680; text-overflow: ellipsis; white-space: nowrap; }
	@media (max-width: 480px) { .side-by-side { gap: 8px; } figcaption { padding: 8px; font-size: 11px; } }
</style>
