import {describe,it,expect} from 'vitest';import {nameColor} from './name';
describe('color naming',()=>{it('uses a neutral name for gray',()=>{expect(nameColor('#808080')).toContain('gray');});it('names a saturated color',()=>{expect(nameColor('#176b6b')).toContain('teal');});});
