import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import gsap from 'gsap';
import { registerInteractable } from './interactables';
import { useMuseumStore } from '../../store/useMuseumStore';
import { sfx } from '../../audio/audioEngine';

// ── Escultura central: nó holográfico + anéis + equalizador ───────────────────
function Sculpture() {
  const group = useRef<THREE.Group>(null);
  const knot = useRef<THREE.Mesh>(null);
  const rings = useRef<THREE.Group>(null);
  const eqBars = useRef<THREE.Group>(null);

  useEffect(() => {
    if (group.current) {
      gsap.fromTo(
        group.current.scale,
        { x: 0.001, y: 0.001, z: 0.001 },
        { x: 1, y: 1, z: 1, duration: 2.2, ease: 'elastic.out(1, 0.55)', delay: 0.3 },
      );
    }
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (knot.current) {
      knot.current.rotation.y += delta * 0.28;
      knot.current.rotation.x = Math.sin(t * 0.22) * 0.35;
    }
    if (rings.current) {
      rings.current.children.forEach((ring, i) => {
        ring.rotation.z += delta * (0.2 + i * 0.12) * (i % 2 === 0 ? 1 : -1);
        ring.rotation.x = Math.PI / 2 + Math.sin(t * 0.3 + i) * 0.28;
      });
    }
    if (eqBars.current) {
      eqBars.current.children.forEach((bar, i) => {
        const h = 0.25 + Math.abs(Math.sin(t * 2.1 + i * 0.55)) * (0.5 + 0.5 * Math.sin(t * 0.7 + i));
        bar.scale.y = h;
        bar.position.y = h / 2;
      });
    }
  });

  const holoMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0b101c',
        emissive: '#8be9fd',
        emissiveIntensity: 1.5,
        roughness: 0.15,
        metalness: 0.9,
      }),
    [],
  );
  const ringMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#9fdcff',
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );
  const eqMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0b101c',
        emissive: '#b388ff',
        emissiveIntensity: 1.8,
        roughness: 0.4,
      }),
    [],
  );

  const bars = useMemo(() => {
    const arr: { x: number; z: number; rotY: number }[] = [];
    const count = 44;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      arr.push({ x: Math.cos(a) * 3.4, z: Math.sin(a) * 3.4, rotY: -a });
    }
    return arr;
  }, []);

  return (
    <group ref={group}>
      {/* Núcleo flutuante */}
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={1.1} floatingRange={[2.3, 3.1]}>
        <mesh ref={knot} material={holoMat} castShadow>
          <torusKnotGeometry args={[0.85, 0.2, 220, 32]} />
        </mesh>
      </Float>

      {/* Anéis orbitais */}
      <group ref={rings} position={[0, 2.7, 0]}>
        {[1.7, 2.2, 2.7].map((r, i) => (
          <mesh key={i} material={ringMat} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, 0.014, 8, 90]} />
          </mesh>
        ))}
      </group>

      {/* Anel equalizador no piso */}
      <group ref={eqBars}>
        {bars.map((b, i) => (
          <mesh key={i} position={[b.x, 0.2, b.z]} rotation={[0, b.rotY, 0]} material={eqMat}>
            <boxGeometry args={[0.09, 1, 0.09]} />
          </mesh>
        ))}
      </group>

      {/* Pedestal */}
      <mesh position={[0, 0.09, 0]} receiveShadow>
        <cylinderGeometry args={[1.35, 1.5, 0.18, 40]} />
        <meshStandardMaterial color="#141b2b" roughness={0.3} metalness={0.85} />
      </mesh>
      <mesh position={[0, 0.19, 0]}>
        <torusGeometry args={[1.28, 0.02, 8, 60]} />
        <meshBasicMaterial color="#8be9fd" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      <pointLight position={[0, 2.6, 0]} intensity={30} color="#8be9fd" distance={13} decay={1.9} />

      {/* Colisor do conjunto */}
      <RigidBody type="fixed" colliders={false} friction={0}>
        <CuboidCollider args={[3.7, 0.6, 3.7]} position={[0, 0.6, 0]} />
      </RigidBody>
    </group>
  );
}

// ── Quiosque do mapa ──────────────────────────────────────────────────────────
function MapKiosk() {
  const holo = useRef<THREE.Mesh>(null);

  useEffect(() => {
    return registerInteractable({
      id: 'map-kiosk',
      position: [8, 1.2, 3],
      radius: 2.6,
      prompt: 'Abrir mapa do museu',
      action: () => {
        sfx.open();
        useMuseumStore.getState().setMapOpen(true);
        document.exitPointerLock();
      },
    });
  }, []);

  useFrame((state, delta) => {
    if (holo.current) {
      holo.current.rotation.y += delta * 0.8;
      holo.current.position.y = 1.45 + Math.sin(state.clock.elapsedTime * 1.4) * 0.06;
    }
  });

  return (
    <group position={[8, 0, 3]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.42, 1, 24]} />
        <meshStandardMaterial color="#141b2b" roughness={0.3} metalness={0.85} />
      </mesh>
      <mesh position={[0, 1.02, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 24]} />
        <meshStandardMaterial color="#0b101c" emissive="#8be9fd" emissiveIntensity={2} roughness={0.4} />
      </mesh>
      <mesh ref={holo} position={[0, 1.45, 0]}>
        <octahedronGeometry args={[0.24, 0]} />
        <meshBasicMaterial color="#8be9fd" wireframe transparent opacity={0.85} />
      </mesh>
      <RigidBody type="fixed" colliders={false} friction={0}>
        <CuboidCollider args={[0.42, 0.55, 0.42]} position={[0, 0.55, 0]} />
      </RigidBody>
    </group>
  );
}

// ── Bancos minimalistas ───────────────────────────────────────────────────────
function Benches() {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#18202f', roughness: 0.35, metalness: 0.8 }), []);
  const positions: [number, number][] = [[-8, 5], [8, -5], [-8, -5], [8, 5]];
  return (
    <group>
      {positions.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.42, 0]} material={mat} castShadow>
            <boxGeometry args={[2.4, 0.1, 0.55]} />
          </mesh>
          {[-0.95, 0.95].map((o) => (
            <mesh key={o} position={[o, 0.19, 0]} material={mat}>
              <boxGeometry args={[0.1, 0.38, 0.45]} />
            </mesh>
          ))}
        </group>
      ))}
      <RigidBody type="fixed" colliders={false} friction={0}>
        {positions.map(([x, z], i) => (
          <CuboidCollider key={i} args={[1.2, 0.25, 0.28]} position={[x, 0.25, z]} />
        ))}
      </RigidBody>
    </group>
  );
}

export function Hall() {
  return (
    <group>
      <Sculpture />
      <MapKiosk />
      <Benches />
    </group>
  );
}
