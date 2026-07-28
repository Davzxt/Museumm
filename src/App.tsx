import { Suspense } from 'react';
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
import { useMuseumStore } from './store/useMuseumStore';

export default function App() {
  const phase = useMuseumStore((s) => s.phase);

  return (
    <>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ fov: 72, near: 0.1, far: 160, position: [26, 1.7, 0] }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
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
        </>
      )}
      <HelpOverlay />
      <KeyboardController />
    </>
  );
}
