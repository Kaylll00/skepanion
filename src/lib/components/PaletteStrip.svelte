<script lang="ts">
 import type { PaletteColor, PaletteSet } from '../types';
 import { suggestMix } from '../color/mix';
 let { palette, paletteSet }: { palette: PaletteColor[]; paletteSet?: PaletteSet } = $props();
</script>
{#if palette.length}
 <div class="strip">{#each palette as color}<div class="swatch"><span class="chip" style={`--color:${color.hex}`}></span><b>{color.name}</b><small>{color.hex} · {Math.round(color.share*100)}%</small><div class="bar"><i style={`width:${Math.max(2,color.share*100)}%;background:${color.hex}`}></i></div>{#if paletteSet}<small class="mix">Approx: {suggestMix(color.hex,paletteSet)?.label ?? 'No palette colors'}</small>{/if}</div>{/each}</div>
{:else}<p class="empty">No strong colors found. Try turning off “ignore paper color” or adding a more colorful stage.</p>{/if}
<style>.strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}.swatch{background:white;border-radius:14px;padding:12px;min-width:0;box-shadow:0 1px 5px #1c352711}.chip{display:block;height:45px;border-radius:9px;background:var(--color);margin-bottom:9px;border:1px solid #0001}.swatch b,.swatch small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.swatch b{font-size:13px}.swatch small{font-size:11px;color:#66736d;margin-top:4px}.bar{height:4px;background:#edf0eb;border-radius:5px;margin-top:8px}.bar i{display:block;height:100%;border-radius:5px}.mix{white-space:normal!important}.empty{color:#66736d}</style>
