import { useMemo, useRef, type ReactElement } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import type { RoomId } from '../../data/content';

// Esculturas interativas por sala — todas animadas e com a cor de destaque da sala

function useAccentMat(accent: string, intensity = 1.7) {
  return useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#0b101c', emissive: accent, emissiveIntensity: intensity, roughness: 0.35, metalness: 0.4 }),
    [accent, intensity],
  );
}

function useMetalMat() {
  return useMemo(() => new THREE.MeshStandardMaterial({ color: '#1a2334', roughness: 0.28, metalness: 0.88 }), []);
}

// ORIGEM — teclas de piano flutuantes
function KeysExhibit({ accent }: { accent: string }) {
  const group = useRef<THREE.Group>(null);
  const accentMat = useAccentMat(accent);
  useFrame((_, d) => { if (group.current) group.current.rotation.y += d * 0.35; });
  return (
    <group ref={group}>
      {Array.from({ length: 8 }, (_, i) => (
        <Float key={i} speed={1.4} floatIntensity={0.5} floatingRange={[0, 0.25]}>
          <mesh position={[(i - 3.5) * 0.24, 0, 0]} material={i % 2 === 0 ? accentMat : undefined}>
            <boxGeometry args={[0.2, 0.08, i % 2 === 0 ? 0.8 : 0.55]} />
            {i % 2 !== 0 && <meshStandardMaterial color="#e8f0f8" roughness={0.4} metalness={0.2} />}
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// HISTÓRIA — rolo de filme girando
function ReelExhibit({ accent }: { accent: string }) {
  const reel = useRef<THREE.Group>(null);
  const accentMat = useAccentMat(accent);
  const metal = useMetalMat();
  useFrame((_, d) => { if (reel.current) reel.current.rotation.y += d * 0.7; });
  return (
    <group ref={reel} rotation={[Math.PI / 2, 0, 0]}>
      <mesh material={metal}><torusGeometry args={[0.7, 0.09, 12, 48]} /></mesh>
      <mesh material={metal}><cylinderGeometry args={[0.16, 0.16, 0.14, 20]} /></mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]} material={accentMat}>
          <boxGeometry args={[1.15, 0.05, 0.06]} />
        </mesh>
      ))}
    </group>
  );
}

// EVOLUÇÃO — chip holográfico com satélites
function ChipExhibit({ accent }: { accent: string }) {
  const sats = useRef<THREE.Group>(null);
  const accentMat = useAccentMat(accent);
  useFrame((_, d) => { if (sats.current) sats.current.rotation.y += d * 1.1; });
  return (
    <group>
      <mesh material={accentMat}><boxGeometry args={[0.55, 0.55, 0.55]} /></mesh>
      <mesh>
        <boxGeometry args={[0.62, 0.62, 0.62]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={0.5} />
      </mesh>
      <group ref={sats}>
        {[0, 1, 2].map((i) => {
          const a = (i / 3) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.85, 0, Math.sin(a) * 0.85]} material={accentMat}>
              <boxGeometry args={[0.1, 0.1, 0.1]} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

// CARACTERÍSTICAS — fita de forma de onda viva
function WaveExhibit({ accent }: { accent: string }) {
  const group = useRef<THREE.Group>(null);
  const accentMat = useAccentMat(accent);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    group.current?.children.forEach((bar, i) => {
      const h = 0.3 + Math.abs(Math.sin(i * 0.65 + t * 2.4)) * 0.75;
      bar.scale.y = h;
    });
  });
  return (
    <group ref={group}>
      {Array.from({ length: 15 }, (_, i) => (
        <mesh key={i} position={[(i - 7) * 0.13, 0, 0]} material={accentMat}>
          <boxGeometry args={[0.08, 1, 0.08]} />
        </mesh>
      ))}
    </group>
  );
}

// COMPOSITORES — matriz de equalizador
function EqExhibit({ accent }: { accent: string }) {
  const group = useRef<THREE.Group>(null);
  const accentMat = useAccentMat(accent);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    group.current?.children.forEach((bar, i) => {
      const h = 0.2 + Math.abs(Math.sin(t * 2 + i * 0.9) * Math.cos(t * 0.6 + i)) * 0.9;
      bar.scale.y = h;
    });
  });
  return (
    <group ref={group}>
      {Array.from({ length: 25 }, (_, i) => {
        const x = (i % 5) - 2;
        const z = Math.floor(i / 5) - 2;
        return (
          <mesh key={i} position={[x * 0.17, 0, z * 0.17]} material={accentMat}>
            <boxGeometry args={[0.11, 1, 0.11]} />
          </mesh>
        );
      })}
    </group>
  );
}

// EXEMPLOS — tela com linha de varredura
function ScreenExhibit({ accent }: { accent: string }) {
  const scan = useRef<THREE.Mesh>(null);
  const accentMat = useAccentMat(accent);
  useFrame((s) => {
    if (scan.current) scan.current.position.y = Math.sin(s.clock.elapsedTime * 1.6) * 0.45;
  });
  return (
    <group>
      <mesh material={accentMat}><boxGeometry args={[1.5, 0.95, 0.05]} /></mesh>
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[1.34, 0.8]} />
        <meshBasicMaterial color="#04070d" />
      </mesh>
      <mesh ref={scan} position={[0, 0, 0.045]}>
        <planeGeometry args={[1.3, 0.05]} />
        <meshBasicMaterial color={accent} transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

// CURIOSIDADES — orbe misterioso
function OrbExhibit({ accent }: { accent: string }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, d) => { if (group.current) { group.current.rotation.y += d * 0.6; group.current.rotation.x += d * 0.2; } });
  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={0.9} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

// IMPORTÂNCIA — globo cultural
function GlobeExhibit({ accent }: { accent: string }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, d) => { if (group.current) group.current.rotation.y += d * 0.45; });
  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[0.6, 20, 14]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={0.4} />
      </mesh>
      {[0.4, 0, -0.4].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[Math.sqrt(0.36 - y * y), 0.012, 6, 40]} />
          <meshBasicMaterial color={accent} transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// CONCLUSÃO — estrela final
function StarExhibit({ accent }: { accent: string }) {
  const group = useRef<THREE.Group>(null);
  const accentMat = useAccentMat(accent, 2.2);
  useFrame((s, d) => {
    if (group.current) {
      group.current.rotation.y += d * 0.9;
      const p = 1 + Math.sin(s.clock.elapsedTime * 2) * 0.06;
      group.current.scale.setScalar(p);
    }
  });
  return (
    <group ref={group}>
      <mesh material={accentMat}><octahedronGeometry args={[0.55, 0]} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.014, 8, 60]} />
        <meshBasicMaterial color={accent} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

const EXHIBITS: Partial<Record<RoomId, (p: { accent: string }) => ReactElement>> = {
  origem: KeysExhibit,
  historia: ReelExhibit,
  evolucao: ChipExhibit,
  caracteristicas: WaveExhibit,
  compositores: EqExhibit,
  exemplos: ScreenExhibit,
  curiosidades: OrbExhibit,
  importancia: GlobeExhibit,
  conclusao: StarExhibit,
};

export function Exhibit({ roomId, accent, position }: { roomId: RoomId; accent: string; position: [number, number, number] }) {
  const Inner = EXHIBITS[roomId];
  const metal = useMetalMat();
  return (
    <group position={position}>
      {/* Pedestal */}
      <mesh position={[0, 0.45, 0]} material={metal} castShadow>
        <cylinderGeometry args={[0.55, 0.7, 0.9, 28]} />
      </mesh>
      <mesh position={[0, 0.92, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.05, 28]} />
        <meshStandardMaterial color="#0b101c" emissive={accent} emissiveIntensity={1.8} roughness={0.4} />
      </mesh>
      {/* Escultura flutuante */}
      <Float speed={1.3} rotationIntensity={0.25} floatIntensity={0.8} floatingRange={[1.45, 1.95]}>
        {Inner ? <Inner accent={accent} /> : null}
      </Float>
      <RigidBody type="fixed" colliders={false} friction={0}>
        <CuboidCollider args={[0.62, 0.5, 0.62]} position={[0, 0.5, 0]} />
      </RigidBody>
    </group>
  );
}
