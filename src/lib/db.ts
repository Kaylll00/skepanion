import Dexie, { type Table } from 'dexie';
import type { Drawing, Stage, PaletteSet } from './types';

class SketchbookDB extends Dexie {
  drawings!: Table<Drawing, string>;
  stages!: Table<Stage, string>;
  paletteSets!: Table<PaletteSet, string>;
  constructor() {
    super('skepanion');
    this.version(1).stores({ drawings: 'id, title, createdAt', stages: 'id, drawingId, createdAt', paletteSets: 'id, name' });
  }
}
export const db = new SketchbookDB();
