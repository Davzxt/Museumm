import { EffectComposer, Bloom, Vignette, SMAA, ChromaticAberration } from '@react-three/postprocessing';
import { Vector2 } from 'three';

// Pós-processamento cinematográfico
export function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        mipmapBlur
        intensity={0.85}
        luminanceThreshold={0.62}
        luminanceSmoothing={0.25}
        radius={0.72}
      />
      <ChromaticAberration offset={new Vector2(0.00045, 0.00045)} radialModulation modulationOffset={0.6} />
      <Vignette eskil={false} offset={0.22} darkness={0.78} />
      <SMAA />
    </EffectComposer>
  );
}
