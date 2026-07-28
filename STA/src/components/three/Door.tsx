import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider, type RapierRigidBody } from '@react-three/rapier';
import { DOORS, type DoorDef } from '../../config/museum';
import { makeTextTexture } from './textTexture';
import { useMuseumStore } from '../../store/useMuseumStore';
import { sfx } from '../../audio/audioEngine';

const PANEL_H = 2.6;
const PANEL_T = 0.07;
const OPEN_DIST = 4.4;

function DoorLabel({ text, accent, x, y, z, rotY }: { text: string; accent: string; x: number; y: number; z: number; rotY: number }) {
  const { texture, aspect } = useMemo(
    () => makeTextTexture({ text: text.toUpperCase(), fontSize: 84, color: '#ffffff', glow: accent, letterSpacing: 12 }),
    [text, accent],
  );
  const w = 2.6;
  return (
    <mesh position={[x, y, z]} rotation={[0, rotY, 0]}>
      <planeGeometry args={[w, w / aspect]} />
      <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function Door({ def }: { def: DoorDef }) {
  const openT = useRef(0);
  const wasOpen = useRef(false);
  const leftBody = useRef<RapierRigidBody>(null);
  const rightBody = useRef<RapierRigidBody>(null);
  const leftMesh = useRef<THREE.Mesh>(null);
  const rightMesh = useRef<THREE.Mesh>(null);

  const panelW = def.width / 2;
  const rotY = def.axis === 'x' ? (def.z > 0 ? Math.PI : 0) : Math.PI / 2;

  const accentMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#0b101c', emissive: def.accent, emissiveIntensity: 2.6, roughness: 0.4 }),
    [def.accent],
  );
  const frameMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#1a2334', roughness: 0.3, metalness: 0.85 }),
    [],
  );
  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#9fd4ef',
        transparent: true,
        opacity: 0.18,
        roughness: 0.08,
        metalness: 0.1,
        envMapIntensity: 1.0,
        side: THREE.DoubleSide,
      }),
    [],
  );

  useFrame((_, delta) => {
    const { playerPos } = useMuseumStore.getState();
    const dx = playerPos.x - def.x;
    const dz = playerPos.z - def.z;
    const near = dx * dx + dz * dz < OPEN_DIST * OPEN_DIST;
    if (near !== wasOpen.current) {
      wasOpen.current = near;
      sfx.door();
    }
    openT.current = THREE.MathUtils.damp(openT.current, near ? 1 : 0, 7, delta);
    const slide = openT.current * (panelW + 0.08);
    const off = panelW / 2;

    const along = def.axis === 'x' ? [slide, 0] : [0, slide];
    const lx = def.x - (def.axis === 'x' ? off + along[0] : 0);
    const lz = def.z - (def.axis === 'z' ? off + along[1] : 0);
    const rx = def.x + (def.axis === 'x' ? off + along[0] : 0);
    const rz = def.z + (def.axis === 'z' ? off + along[1] : 0);

    leftMesh.current?.position.set(lx, PANEL_H / 2, lz);
    rightMesh.current?.position.set(rx, PANEL_H / 2, rz);
    leftBody.current?.setNextKinematicTranslation({ x: lx, y: PANEL_H / 2, z: lz });
    rightBody.current?.setNextKinematicTranslation({ x: rx, y: PANEL_H / 2, z: rz });
  });

  const frameOffset = def.width / 2 + 0.12;
  const postA: [number, number, number] = def.axis === 'x' ? [def.x - frameOffset, PANEL_H / 2 + 0.15, def.z] : [def.x, PANEL_H / 2 + 0.15, def.z - frameOffset];
  const postB: [number, number, number] = def.axis === 'x' ? [def.x + frameOffset, PANEL_H / 2 + 0.15, def.z] : [def.x, PANEL_H / 2 + 0.15, def.z + frameOffset];
  const lintelSize: [number, number, number] = def.axis === 'x' ? [def.width + 0.5, 0.22, 0.34] : [0.34, 0.22, def.width + 0.5];
  const postSize: [number, number, number] = def.axis === 'x' ? [0.16, PANEL_H + 0.3, 0.34] : [0.34, PANEL_H + 0.3, 0.16];
  const panelSize: [number, number, number] = def.axis === 'x' ? [panelW, PANEL_H, PANEL_T] : [PANEL_T, PANEL_H, panelW];
  const colliderSize: [number, number, number] = def.axis === 'x' ? [panelW / 2, PANEL_H / 2, PANEL_T / 2 + 0.02] : [PANEL_T / 2 + 0.02, PANEL_H / 2, panelW / 2];

  return (
    <group>
      {/* Batente */}
      <mesh position={postA} material={frameMat}><boxGeometry args={postSize} /></mesh>
      <mesh position={postB} material={frameMat}><boxGeometry args={postSize} /></mesh>
      <mesh position={[def.x, PANEL_H + 0.2, def.z]} material={frameMat}><boxGeometry args={lintelSize} /></mesh>
      <mesh position={[def.x, PANEL_H + 0.09, def.z]} material={accentMat}>
        <boxGeometry args={def.axis === 'x' ? [def.width + 0.44, 0.045, 0.36] : [0.36, 0.045, def.width + 0.44]} />
      </mesh>

      <DoorLabel text={def.label} accent={def.accent} x={def.x} y={PANEL_H + 0.72} z={def.z} rotY={rotY} />

      {/* Folhas de vidro (visuais) */}
      <mesh ref={leftMesh} material={glassMat} position={[def.x - (def.axis === 'x' ? panelW / 2 : 0), PANEL_H / 2, def.z - (def.axis === 'z' ? panelW / 2 : 0)]}>
        <boxGeometry args={panelSize} />
      </mesh>
      <mesh ref={rightMesh} material={glassMat} position={[def.x + (def.axis === 'x' ? panelW / 2 : 0), PANEL_H / 2, def.z + (def.axis === 'z' ? panelW / 2 : 0)]}>
        <boxGeometry args={panelSize} />
      </mesh>

      {/* Colisores cinemáticos das folhas */}
      <RigidBody ref={leftBody} type="kinematicPosition" colliders={false} position={[def.x - (def.axis === 'x' ? panelW / 2 : 0), PANEL_H / 2, def.z - (def.axis === 'z' ? panelW / 2 : 0)]}>
        <CuboidCollider args={colliderSize} />
      </RigidBody>
      <RigidBody ref={rightBody} type="kinematicPosition" colliders={false} position={[def.x + (def.axis === 'x' ? panelW / 2 : 0), PANEL_H / 2, def.z + (def.axis === 'z' ? panelW / 2 : 0)]}>
        <CuboidCollider args={colliderSize} />
      </RigidBody>
    </group>
  );
}

export function Doors() {
  return (
    <group>
      {DOORS.map((d) => (
        <Door key={d.id} def={d} />
      ))}
    </group>
  );
}
