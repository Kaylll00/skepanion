import {describe,it,expect} from 'vitest';import {extractPalette} from './extract';
function image(values:number[]):ImageData{return {data:new Uint8ClampedArray(values)} as ImageData;}
describe('palette extraction',()=>{it('ignores near-white paper and returns no colors on a blank page',()=>{expect(extractPalette(image([250,250,248,255,255,255,255,255]),true)).toHaveLength(0);});it('extracts and sorts colors by share',()=>{const p=extractPalette(image([200,20,20,255,200,20,20,255,20,20,200,255]),false,2);expect(p).toHaveLength(2);expect(p[0].share).toBeGreaterThan(p[1].share);});});
