import { EffectComposer, Bloom, Vignette, SMAA, ChromaticAberration } from '@react-three/postprocessing';
import { Vector2 } from 'three';
import { useQualityStore } from '../../store/useQualityStore';

// Pós-processamento cinematográfico — adaptativo por qualidade
export function Effects() {
  const q = useQualityStore((s) => s.settings);

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        mipmapBlur
        intensity={q.bloom ? q.bloomIntensity : 0}
        luminanceThreshold={q.bloom ? 0.62 : 99}
        luminanceSmoothing={0.25}
        radius={0.72}
      />
      <ChromaticAberration
        offset={q.chromaticAberration ? new Vector2(0.00045, 0.00045) : new Vector2(0, 0)}
        radialModulation={q.chromaticAberration}
        modulationOffset={0.6}
      />
      <Vignette eskil={false} offset={q.vignette ? 0.22 : 0} darkness={q.vignette ? 0.78 : 0} />
      <SMAA />
    </EffectComposer>
  );
}
