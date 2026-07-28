import { Physics } from '@react-three/rapier';
import { Environment, Lightformer } from '@react-three/drei';
import { Lighting } from './Lighting';
import { Effects } from './Effects';
import { Museum } from './Museum';
import { Doors } from './Door';
import { Hall } from './Hall';
import { Rooms } from './Rooms';
import { Player } from './Player';
import { Particles } from './Particles';
import { useMuseumStore } from '../../store/useMuseumStore';

export function Experience() {
  const phase = useMuseumStore((s) => s.phase);

  return (
    <>
      <fog attach="fog" args={['#05070d', 34, 110]} />
      <Lighting />

      {/* Ambiente procedural (offline) para reflexos PBR */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#0a0f1a']} />
        <Lightformer intensity={2.4} position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[14, 14, 1]} color="#9fdcff" />
        <Lightformer intensity={1.1} position={[-8, 3, -6]} rotation={[0, Math.PI / 3, 0]} scale={[8, 3, 1]} color="#b388ff" />
        <Lightformer intensity={1.1} position={[8, 3, 6]} rotation={[0, -Math.PI / 3, 0]} scale={[8, 3, 1]} color="#8be9fd" />
        <Lightformer intensity={0.6} position={[0, 2, 10]} scale={[10, 2, 1]} color="#ffffff" />
      </Environment>

      <Physics paused={phase !== 'playing'} timeStep={1 / 60} gravity={[0, -18, 0]}>
        <Museum />
        <Doors />
        <Hall />
        <Rooms />
        <Player />
      </Physics>

      <Particles />
      <Effects />
    </>
  );
}
