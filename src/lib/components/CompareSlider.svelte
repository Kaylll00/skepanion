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
 .compare{position:relative;overflow:hidden;width:100%;aspect-ratio:3/4;border:1px solid rgb(32 53 47 / 8%);border-radius:18px;background:#e9e5dc;box-shadow:0 8px 24px rgb(32 53 47 / 8%);touch-action:pan-y}.compare img{width:100%;height:100%;object-fit:contain;position:absolute;inset:0}.clip{position:absolute;inset:0;clip-path:inset(0 calc(100% - var(--split)) 0 0)}.divider{position:absolute;top:0;bottom:0;width:2px;background:#fff;box-shadow:0 0 8px #1a292355;pointer-events:none;transition:left 70ms linear}.divider::after{content:'↔';position:absolute;left:50%;top:50%;width:42px;height:42px;display:grid;place-items:center;transform:translate(-50%,-50%);border:2px solid #fff;border-radius:50%;background:#fffefa;color:#285b49;font-size:20px;font-weight:700;box-shadow:0 3px 12px #1a292344}.compare input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;margin:0}.compare input:focus-visible{outline:3px solid #bc7858;outline-offset:-4px;border-radius:18px}
</style>
