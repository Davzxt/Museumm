import { create } from 'zustand';

export type QualityPreset = 'low' | 'medium' | 'high' | 'ultra';

export interface QualitySettings {
  preset: QualityPreset;
  dpr: [number, number];
  shadows: boolean;
  shadowMapSize: number;
  bloom: boolean;
  bloomIntensity: number;
  chromaticAberration: boolean;
  vignette: boolean;
  smaa: boolean;
  reflectorFloor: boolean;
  reflectorResolution: number;
  envResolution: number;
  envFrames: number;
  particleMultiplier: number;
  fogNear: number;
  fogFar: number;
  lightCount: 'reduced' | 'full';
  touchControls: boolean;
}

const PRESETS: Record<QualityPreset, QualitySettings> = {
  low: {
    preset: 'low',
    dpr: [0.75, 1],
    shadows: false,
    shadowMapSize: 512,
    bloom: true,
    bloomIntensity: 0.5,
    chromaticAberration: false,
    vignette: true,
    smaa: false,
    reflectorFloor: false,
    reflectorResolution: 256,
    envResolution: 128,
    envFrames: 1,
    particleMultiplier: 0.3,
    fogNear: 20,
    fogFar: 70,
    lightCount: 'reduced',
    touchControls: false,
  },
  medium: {
    preset: 'medium',
    dpr: [0.85, 1.5],
    shadows: true,
    shadowMapSize: 1024,
    bloom: true,
    bloomIntensity: 0.75,
    chromaticAberration: false,
    vignette: true,
    smaa: true,
    reflectorFloor: true,
    reflectorResolution: 512,
    envResolution: 256,
    envFrames: 1,
    particleMultiplier: 0.6,
    fogNear: 30,
    fogFar: 90,
    lightCount: 'full',
    touchControls: false,
  },
  high: {
    preset: 'high',
    dpr: [1, 1.75],
    shadows: true,
    shadowMapSize: 1024,
    bloom: true,
    bloomIntensity: 0.85,
    chromaticAberration: true,
    vignette: true,
    smaa: true,
    reflectorFloor: true,
    reflectorResolution: 1024,
    envResolution: 256,
    envFrames: 1,
    particleMultiplier: 1,
    fogNear: 34,
    fogFar: 110,
    lightCount: 'full',
    touchControls: false,
  },
  ultra: {
    preset: 'ultra',
    dpr: [1, 2],
    shadows: true,
    shadowMapSize: 2048,
    bloom: true,
    bloomIntensity: 1,
    chromaticAberration: true,
    vignette: true,
    smaa: true,
    reflectorFloor: true,
    reflectorResolution: 2048,
    envResolution: 512,
    envFrames: 2,
    particleMultiplier: 1.5,
    fogNear: 40,
    fogFar: 130,
    lightCount: 'full',
    touchControls: false,
  },
};

interface QualityState {
  settings: QualitySettings;
  autoDetected: boolean;
  setPreset: (p: QualityPreset) => void;
  setTouchControls: (v: boolean) => void;
}

function detectGPU(): QualityPreset {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return 'low';
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (ext) {
      const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL).toLowerCase();
      if (/intel|mesa|llvmpipe|swiftshader|virtualbox|vmware/i.test(renderer)) return 'low';
      if (/mali|adreno|powervr|apple gpu/i.test(renderer)) return 'medium';
    }
    const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    if (maxTex < 4096) return 'low';
    if (maxTex < 8192) return 'medium';
    return 'high';
  } catch {
    return 'medium';
  }
}

const detected = detectGPU();

export const useQualityStore = create<QualityState>((set) => ({
  settings: PRESETS[detected],
  autoDetected: true,
  setPreset: (p) => set({ settings: PRESETS[p], autoDetected: false }),
  setTouchControls: (v) => set((s) => ({ settings: { ...s.settings, touchControls: v } })),
}));

export function getQuality(): QualitySettings {
  return useQualityStore.getState().settings;
}
