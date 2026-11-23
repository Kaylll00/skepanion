export type Lab = [number, number, number];
export function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '');
  if (!/^[\da-f]{6}$/i.test(value)) throw new Error(`Invalid hex color: ${hex}`);
  return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)];
}
export function rgbToHex(r: number, g: number, b: number): string { return `#${[r,g,b].map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')}`; }
function linear(v: number): number { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }
export function rgbToLab(r: number, g: number, b: number): Lab {
  const R=linear(r), G=linear(g), B=linear(b);
  const x=(R*.4124564+G*.3575761+B*.1804375)/.95047, y=R*.2126729+G*.7151522+B*.072175, z=(R*.0193339+G*.119192+B*.9503041)/1.08883;
  const f=(v:number)=>v>.008856?Math.cbrt(v):7.787*v+16/116;
  const fx=f(x),fy=f(y),fz=f(z); return [116*fy-16,500*(fx-fy),200*(fy-fz)];
}
export function hexToLab(hex: string): Lab { return rgbToLab(...hexToRgb(hex)); }
export function labDistance(a: Lab, b: Lab): number { return Math.hypot(a[0]-b[0], a[1]-b[1], a[2]-b[2]); }
