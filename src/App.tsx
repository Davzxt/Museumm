import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/three/Experience';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { MainMenu } from './components/ui/MainMenu';
import { HUD } from './components/ui/HUD';
import { PanelModal } from './components/ui/PanelModal';
import { SpeakerModal } from './components/ui/SpeakerModal';
import { MapOverlay } from './components/ui/MapOverlay';
import { HelpOverlay } from './components/ui/HelpOverlay';
import { PauseOverlay } from './components/ui/PauseOverlay';
import { KeyboardController } from './components/ui/KeyboardController';
import { TouchControls } from './components/ui/TouchControls';
import { QualitySelector } from './components/ui/QualitySelector';
import { useMuseumStore } from './store/useMuseumStore';
import { useQualityStore } from './store/useQualityStore';

export default function App() {
  const phase = useMuseumStore((s) => s.phase);
  const q = useQualityStore((s) => s.settings);

  const glOpts = useMemo(() => ({
    antialias: false,
    powerPreference: 'high-performance' as const,
    ...(q.preset === 'low' ? { precision: 'lowp' as const } : {}),
  }), [q.preset]);

  return (
    <>
      <Canvas
        shadows={q.shadows}
        dpr={q.dpr}
        camera={{ fov: 72, near: 0.1, far: 160, position: [26, 1.7, 0] }}
        gl={glOpts}
        onCreated={({ gl }) => gl.setClearColor('#05070d')}
      >
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>

      {phase === 'boot' && <LoadingScreen />}
      {phase === 'menu' && <MainMenu />}
      {phase === 'playing' && (
        <>
          <HUD />
          <PanelModal />
          <SpeakerModal />
          <MapOverlay />
          <PauseOverlay />
          {q.touchControls && <TouchControls />}
        </>
      )}
      <HelpOverlay />
      <KeyboardController />
      <QualitySelector />
    </>
  );
}
