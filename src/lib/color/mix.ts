import { hexToLab, rgbToHex, type Lab, labDistance } from './lab';
import type { PaletteSet } from '../types';
export type MixSuggestion={hex:string;label:string;distance:number};
export function suggestMix(target: string, set: PaletteSet): MixSuggestion | null {
  if(!set.colors.length)return null;
  const wanted=hexToLab(target); let best:{lab:Lab;label:string;distance:number}|undefined;
  const consider=(lab:Lab,label:string)=>{const distance=labDistance(wanted,lab);if(!best||distance<best.distance)best={lab,label,distance};};
  for(const c of set.colors)consider(hexToLab(c.hex),c.name);
  const ratios=[[2,1],[1,1],[1,2]] as const;
  for(let i=0;i<set.colors.length;i++)for(let j=i+1;j<set.colors.length;j++)for(const [a,b] of ratios){const x=hexToLab(set.colors[i].hex),y=hexToLab(set.colors[j].hex),lab:[number,number,number]=[0,1,2].map(k=>(x[k]*a+y[k]*b)/(a+b)) as Lab;consider(lab,`about ${a} part${a>1?'s':''} ${set.colors[i].name} + ${b} part${b>1?'s':''} ${set.colors[j].name}`);}
  return best?{hex:rgbToHex(...labToRgbApprox(best.lab)),label:best.label,distance:best.distance}:null;
}
function labToRgbApprox(lab:Lab):[number,number,number]{const fy=(lab[0]+16)/116,fx=lab[1]/500+fy,fz=fy-lab[2]/200,f=(v:number)=>v**3>.008856?v**3:(v-16/116)/7.787,x=.95047*f(fx),y=f(fy),z=1.08883*f(fz),linear=[3.2404542*x-1.5371385*y-.4985314*x,-.969266*x+1.8760108*y+.041556*z,.0556434*x-.2040259*y+1.0572252*z];return linear.map(v=>{const n=v<=.0031308?12.92*v:1.055*Math.max(0,v)**(1/2.4)-.055;return Math.max(0,Math.min(255,Math.round(n*255)));}) as [number,number,number];}
