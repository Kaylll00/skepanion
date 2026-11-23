<script lang="ts">
 import type { Stage } from '../types';
 let { stages, selected = $bindable(''), onselect }: { stages: Stage[]; selected?: string; onselect?: (id:string)=>void } = $props();
 let urls=$state<Record<string,string>>({});
 $effect(()=>{for(const s of stages)if(!urls[s.id])urls[s.id]=URL.createObjectURL(s.flatBlob);return()=>{for(const u of Object.values(urls))URL.revokeObjectURL(u);};});
</script>
<div class="timeline">{#each stages as stage (stage.id)}<button class:active={selected===stage.id} onclick={()=>{selected=stage.id;onselect?.(stage.id)}}><img src={urls[stage.id]} alt=""/><span>{new Date(stage.createdAt).toLocaleDateString()}</span></button>{/each}</div>
<style>.timeline{display:flex;gap:10px;overflow-x:auto;padding:4px 2px 12px}.timeline button{flex:0 0 82px;border:2px solid transparent;background:transparent;border-radius:13px;padding:3px;text-align:left;color:#56645d;cursor:pointer}.timeline button.active{border-color:#2f6553}.timeline img{width:100%;height:88px;object-fit:cover;border-radius:9px;background:#eee}.timeline span{display:block;font-size:11px;padding:5px 2px}</style>
