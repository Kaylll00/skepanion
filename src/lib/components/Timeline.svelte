<script lang="ts">
 import type { Stage } from '../types';
 let { stages, selected = $bindable(''), onselect }: { stages: Stage[]; selected?: string; onselect?: (id:string)=>void } = $props();
 let urls=$state<Record<string,string>>({});
 $effect(()=>{for(const s of stages)if(!urls[s.id])urls[s.id]=URL.createObjectURL(s.flatBlob);return()=>{for(const u of Object.values(urls))URL.revokeObjectURL(u);};});
</script>
<div class="timeline">{#each stages as stage (stage.id)}<button class:active={selected===stage.id} onclick={()=>{selected=stage.id;onselect?.(stage.id)}}><img src={urls[stage.id]} alt=""/><span>{new Date(stage.createdAt).toLocaleDateString()}</span></button>{/each}</div>
<style>.timeline{display:flex;gap:12px;overflow-x:auto;padding:7px 3px 15px;scroll-snap-type:x mandatory;scrollbar-width:thin;scrollbar-color:#d4ddd3 transparent}.timeline button{flex:0 0 86px;border:1px solid transparent;background:transparent;border-radius:14px;padding:5px;text-align:left;color:#718078;cursor:pointer;scroll-snap-align:start;transition:transform 180ms ease,border-color 180ms ease,background 180ms ease,color 180ms ease}.timeline button:hover{transform:translateY(-2px);color:#294b3e}.timeline button.active{border-color:#8cae94;background:#edf3eb;color:#294b3e}.timeline img{width:100%;height:88px;object-fit:cover;border-radius:10px;background:#eee;box-shadow:0 2px 7px #20352f14}.timeline span{display:block;font-size:11px;padding:7px 2px 2px;font-weight:600;white-space:nowrap}</style>
