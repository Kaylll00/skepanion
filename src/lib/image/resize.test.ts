import {describe,it,expect} from 'vitest';import {fitSize} from './resize';
describe('image resize',()=>{it('fits within bounds without upscaling',()=>{expect(fitSize(2400,1600,1200,1200)).toEqual({width:1200,height:800});expect(fitSize(300,200,1200,1200)).toEqual({width:300,height:200});});it('rejects invalid dimensions',()=>{expect(()=>fitSize(0,100,200,200)).toThrow();});});
