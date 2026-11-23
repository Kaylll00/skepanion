export type Pt = { x: number; y: number };
export type PaletteColor = { hex: string; lab: [number, number, number]; share: number; name: string };
export type Drawing = { id: string; title: string; createdAt: number; paletteSetId?: string };
export type Stage = { id: string; drawingId: string; createdAt: number; originalBlob: Blob; flatBlob: Blob; corners: [Pt, Pt, Pt, Pt]; palette: PaletteColor[]; label?: string; note?: string };
export type PaletteSet = { id: string; name: string; colors: { name: string; hex: string }[] };
