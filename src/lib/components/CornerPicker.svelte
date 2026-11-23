<script lang="ts">
 import type { Pt } from '../types';
 let { image, corners = $bindable(), onready }: { image: string; corners: [Pt,Pt,Pt,Pt]; onready?: (size:{width:number;height:number})=>void } = $props();
 let box=$state({width:1,height:1,left:0,top:0}); let active=$state(-1); let imgEl:HTMLImageElement;
 const names=['Top left','Top right','Bottom right','Bottom left'];
 function measure(){const r=imgEl.getBoundingClientRect();box={width:r.width,height:r.height,left:r.left,top:r.top};if(imgEl.naturalWidth)onready?.({width:imgEl.naturalWidth,height:imgEl.naturalHeight});}
 function down(e:PointerEvent,i:number){active=i;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);move(e);}
 function move(e:PointerEvent){if(active<0)return;const x=Math.max(0,Math.min(1,(e.clientX-box.left)/box.width)),y=Math.max(0,Math.min(1,(e.clientY-box.top)/box.height));corners[active]={x,y};corners=[...corners] as [Pt,Pt,Pt,Pt];}
 function keyMove(e:KeyboardEvent,i:number){const step=e.shiftKey ? 0.01 : 0.005;let dx=0,dy=0;if(e.key==='ArrowLeft')dx=-step;else if(e.key==='ArrowRight')dx=step;else if(e.key==='ArrowUp')dy=-step;else if(e.key==='ArrowDown')dy=step;else return;e.preventDefault();corners[i]={x:Math.max(0,Math.min(1,corners[i].x+dx)),y:Math.max(0,Math.min(1,corners[i].y+dy))};corners=[...corners] as [Pt,Pt,Pt,Pt];}
 function up(){active=-1;}
</script>
<div class="picker"><img bind:this={imgEl} src={image} alt="" onload={measure} onresize={measure}/>{#each corners as point,i}<button class="handle" aria-label={`Move ${names[i]} corner. Use arrow keys to adjust.`} style={`left:${point.x*100}%;top:${point.y*100}%`} onpointerdown={(e)=>down(e,i)} onpointermove={move} onpointerup={up} onpointercancel={up} onkeydown={(e)=>keyMove(e,i)}>{i+1}</button>{/each}<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polygon points={corners.map(p=>`${p.x*100},${p.y*100}`).join(' ')} /></svg></div>
<p class="hint">Drag the numbered handles to the paper corners in order: top left, top right, bottom right, bottom left.</p>
<style>.picker{position:relative;display:inline-block;max-width:100%;line-height:0;touch-action:none}.picker img{display:block;max-width:100%;max-height:62vh;width:auto;height:auto;border-radius:14px}.picker svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.picker polygon{fill:#34ba7733;stroke:#147b53;stroke-width:.6;vector-effect:non-scaling-stroke}.handle{position:absolute;z-index:2;transform:translate(-50%,-50%);width:42px;height:42px;border-radius:50%;border:3px solid white;background:#1c7051;color:white;font-weight:800;touch-action:none;box-shadow:0 1px 7px #0008}.hint{font-size:13px;color:#66736d;line-height:1.5}</style>
