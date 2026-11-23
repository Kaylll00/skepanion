<script lang="ts">
  let { before, after, label = 'Compare stages' }: { before: string; after: string; label?: string } = $props();
  let position = $state(50);
</script>
<div class="compare" style={`--split:${position}%`} aria-label={label}>
  <img class="base" src={after} alt="Latest stage" />
  <div class="clip"><img src={before} alt="Earlier stage" /></div>
  <div class="divider" style={`left:${position}%`}></div>
  <input aria-label="Drag to compare stages" type="range" min="0" max="100" bind:value={position} />
</div>
<style>
 .compare{position:relative;overflow:hidden;width:100%;aspect-ratio:3/4;border-radius:18px;background:#e9e5dc;touch-action:pan-y}.compare img{width:100%;height:100%;object-fit:contain;position:absolute;inset:0}.clip{position:absolute;inset:0;clip-path:inset(0 calc(100% - var(--split)) 0 0)}.divider{position:absolute;top:0;bottom:0;width:3px;background:#fff;box-shadow:0 0 5px #333}.compare input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;margin:0}
</style>
