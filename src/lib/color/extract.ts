import { hexToLab, rgbToHex } from './lab';
import { nameColor } from './name';
import type { PaletteColor } from '../types';
type Pixel = { r:number;g:number;b:number };
function medianCut(pixels: Pixel[], count: number): Pixel[][] {
  let boxes=[pixels];
  while(boxes.length<count){
    let index=-1, range=-1;
    boxes.forEach((box,i)=>{ if(box.length<2)return; const channels=['r','g','b'] as const; const spread=Math.max(...channels.map(c=>Math.max(...box.map(p=>p[c]))-Math.min(...box.map(p=>p[c])))); if(spread>range){range=spread;index=i;} });
    if(index<0)break;
    const box=boxes.splice(index,1)[0]; const spans=(['r','g','b'] as const).map(c=>Math.max(...box.map(p=>p[c]))-Math.min(...box.map(p=>p[c]))); const channel=(['r','g','b'] as const)[spans.indexOf(Math.max(...spans))];
    box.sort((a,b)=>a[channel]-b[channel]); const mid=Math.floor(box.length/2); boxes.push(box.slice(0,mid),box.slice(mid));
  }
  return boxes;
}
export function extractPalette(data: ImageData, ignorePaper=true, count=5): PaletteColor[] {
  const pixels:Pixel[]=[];
  for(let i=0;i<data.data.length;i+=4){ const r=data.data[i],g=data.data[i+1],b=data.data[i+2]; if(data.data[i+3]<128)continue; if(ignorePaper && r>238&&g>238&&b>232&&Math.max(r,g,b)-Math.min(r,g,b)<18)continue; pixels.push({r,g,b}); }
  if(!pixels.length)return [];
  return medianCut(pixels,Math.min(count,pixels.length)).map(box=>{const n=box.length,r=box.reduce((s,p)=>s+p.r,0)/n,g=box.reduce((s,p)=>s+p.g,0)/n,b=box.reduce((s,p)=>s+p.b,0)/n,hex=rgbToHex(r,g,b);return {hex,lab:hexToLab(hex),share:n/pixels.length,name:nameColor(hex)};}).sort((a,b)=>b.share-a.share);
}
