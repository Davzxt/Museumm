import * as THREE from 'three';

// Texto renderizado em canvas → textura (100% offline, sem fontes externas)

interface TextTextureOptions {
  text: string;
  fontSize?: number;
  color?: string;
  weight?: number | string;
  letterSpacing?: number;
  fontFamily?: string;
  glow?: string;
}

export function makeTextTexture({
  text,
  fontSize = 96,
  color = '#e8f0f8',
  weight = 700,
  letterSpacing = 0,
  fontFamily = "'Segoe UI', Inter, system-ui, sans-serif",
  glow,
}: TextTextureOptions): { texture: THREE.CanvasTexture; aspect: number } {
  const scale = 2; // nitidez
  const fs = fontSize * scale;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  ctx.font = `${weight} ${fs}px ${fontFamily}`;

  let width = ctx.measureText(text).width;
  if (letterSpacing > 0) width += letterSpacing * scale * (text.length - 1);

  canvas.width = Math.ceil(width + fs * 0.4);
  canvas.height = Math.ceil(fs * 1.5);

  ctx.font = `${weight} ${fs}px ${fontFamily}`;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  if (glow) {
    ctx.shadowColor = glow;
    ctx.shadowBlur = fs * 0.25;
  }

  if (letterSpacing > 0) {
    let x = fs * 0.2;
    const y = canvas.height / 2;
    for (const ch of text) {
      ctx.fillText(ch, x, y);
      x += ctx.measureText(ch).width + letterSpacing * scale;
    }
  } else {
    ctx.fillText(text, fs * 0.2, canvas.height / 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return { texture, aspect: canvas.width / canvas.height };
}
