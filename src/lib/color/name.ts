import { hexToLab, hexToRgb } from './lab';
export function nameColor(hex: string): string {
  const [r,g,b]=hexToRgb(hex), [l,a,bb]=hexToLab(hex), chroma=Math.hypot(a,bb);
  if(chroma<12) return l>88?'pale gray':l<25?'deep charcoal':l<55?'warm gray':'light gray';
  const hue=(Math.atan2(bb,a)*180/Math.PI+360)%360;
  const hueName=hue<18||hue>=345?'rose':hue<45?'red-orange':hue<70?'amber':hue<100?'yellow':hue<145?'olive':hue<175?'green':hue<205?'teal':hue<250?'blue':hue<280?'indigo':hue<315?'violet':'magenta';
  const light=l>82?'light':l<38?'deep':chroma<30?'muted':chroma>65?'bright':'soft';
  void r; void g; void b;
  return `${light} ${hueName}`;
}
