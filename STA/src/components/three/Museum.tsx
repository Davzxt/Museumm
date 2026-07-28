import { useMemo } from 'react';
import * as THREE from 'three';
import { RigidBody, CuboidCollider, CylinderCollider } from '@react-three/rapier';
import { MeshReflectorMaterial } from '@react-three/drei';
import { WALLS, FLOOR, ROOM_ZONES, HALL_HEIGHT } from '../../config/museum';
import { makeTextTexture } from './textTexture';

// Materiais compartilhados (evitam recriação a cada render)
const wallMat = new THREE.MeshStandardMaterial({ color: '#131a29', roughness: 0.52, metalness: 0.38 });
const ceilingMat = new THREE.MeshStandardMaterial({ color: '#0b101c', roughness: 0.6, metalness: 0.3 });
const darkFloorMat = new THREE.MeshStandardMaterial({ color: '#0d1322', roughness: 0.25, metalness: 0.7 });
const columnMat = new THREE.MeshStandardMaterial({ color: '#1a2334', roughness: 0.25, metalness: 0.85 });
const trimCyan = new THREE.MeshStandardMaterial({ color: '#0b101c', emissive: '#8be9fd', emissiveIntensity: 2.4, roughness: 0.4 });
const trimWhite = new THREE.MeshStandardMaterial({ color: '#0b101c', emissive: '#eaf6ff', emissiveIntensity: 2.8, roughness: 0.4 });

function TextPlane({ text, width, y, x, z, rotY, fontSize = 120, color = '#eaf7ff', glow = '#8be9fd', letterSpacing = 18, opacity = 1 }: {
  text: string; width: number; x: number; y: number; z: number; rotY: number;
  fontSize?: number; color?: string; glow?: string; letterSpacing?: number; opacity?: number;
}) {
  const { texture, aspect } = useMemo(
    () => makeTextTexture({ text, fontSize, color, glow, letterSpacing }),
    [text, fontSize, color, glow, letterSpacing],
  );
  return (
    <mesh position={[x, y, z]} rotation={[0, rotY, 0]}>
      <planeGeometry args={[width, width / aspect]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function Walls() {
  return (
    <group>
      {WALLS.map((w, i) => (
        <mesh key={i} position={[w.cx, w.h / 2, w.cz]} material={wallMat} receiveShadow>
          <boxGeometry args={[w.w, w.h, w.d]} />
        </mesh>
      ))}
      {/* Colisores das paredes */}
      <RigidBody type="fixed" colliders={false} friction={0}>
        {WALLS.map((w, i) => (
          <CuboidCollider key={i} args={[w.w / 2, w.h / 2, w.d / 2]} position={[w.cx, w.h / 2, w.cz]} />
        ))}
      </RigidBody>
    </group>
  );
}

function Floors() {
  const zones = ROOM_ZONES.filter((z) => z.id !== 'hall');
  return (
    <group>
      {/* Colisor do chão (laje única) */}
      <RigidBody type="fixed" colliders={false} friction={0.2}>
        <CuboidCollider
          args={[(FLOOR.maxX - FLOOR.minX) / 2, 0.1, (FLOOR.maxZ - FLOOR.minZ) / 2]}
          position={[(FLOOR.minX + FLOOR.maxX) / 2, -0.1, (FLOOR.minZ + FLOOR.maxZ) / 2]}
        />
      </RigidBody>

      {/* Hall — piso espelhado */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[40, 20]} />
        <MeshReflectorMaterial
          blur={[280, 60]}
          resolution={1024}
          mixBlur={1}
          mixStrength={9}
          roughness={0.85}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0f18"
          metalness={0.55}
          mirror={0.5}
        />
      </mesh>

      {/* Demais pisos (por zona, sem sobrepor o hall) */}
      {zones.map((z) => (
        <mesh
          key={z.id}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[(z.minX + z.maxX) / 2, 0.002, (z.minZ + z.maxZ) / 2]}
          material={darkFloorMat}
          receiveShadow
        >
          <planeGeometry args={[z.maxX - z.minX, z.maxZ - z.minZ]} />
        </mesh>
      ))}
    </group>
  );
}

function Ceilings() {
  const zones = ROOM_ZONES.filter((z) => z.id !== 'hall');
  return (
    <group>
      {/* Teto do hall */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, HALL_HEIGHT, 0]} material={ceilingMat}>
        <planeGeometry args={[40.4, 20.4]} />
      </mesh>
      {/* Claraboias emissivas do hall */}
      {[-5.5, 0, 5.5].map((z) => (
        <mesh key={z} position={[0, HALL_HEIGHT - 0.04, z]} material={trimWhite}>
          <boxGeometry args={[30, 0.06, 0.9]} />
        </mesh>
      ))}

      {zones.map((z) => {
        const cx = (z.minX + z.maxX) / 2;
        const cz = (z.minZ + z.maxZ) / 2;
        const w = z.maxX - z.minX;
        const d = z.maxZ - z.minZ;
        return (
          <group key={z.id}>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[cx, z.ceiling, cz]} material={ceilingMat}>
              <planeGeometry args={[w + 0.4, d + 0.4]} />
            </mesh>
            <mesh position={[cx, z.ceiling - 0.04, cz]}>
              <boxGeometry args={[Math.min(w - 2, 6), 0.05, 0.45]} />
              <meshStandardMaterial color="#0b101c" emissive={z.accent} emissiveIntensity={2.2} roughness={0.4} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Columns() {
  const xs = [-16, -8, 8, 16];
  const zs = [-9.45, 9.45];
  return (
    <group>
      {xs.flatMap((x) =>
        zs.map((z) => (
          <group key={`${x}-${z}`} position={[x, 0, z]}>
            <mesh position={[0, HALL_HEIGHT / 2, 0]} material={columnMat}>
              <cylinderGeometry args={[0.24, 0.3, HALL_HEIGHT, 20]} />
            </mesh>
            <mesh position={[0, 0.55, 0]} material={trimCyan}>
              <cylinderGeometry args={[0.32, 0.32, 0.07, 20]} />
            </mesh>
            <mesh position={[0, HALL_HEIGHT - 0.55, 0]} material={trimCyan}>
              <cylinderGeometry args={[0.3, 0.3, 0.07, 20]} />
            </mesh>
          </group>
        )),
      )}
      <RigidBody type="fixed" colliders={false} friction={0}>
        {xs.flatMap((x) => zs.map((z) => (
          <CylinderCollider key={`${x}-${z}`} args={[HALL_HEIGHT / 2, 0.3]} position={[x, HALL_HEIGHT / 2, z]} />
        )))}
      </RigidBody>
    </group>
  );
}

function Signage() {
  return (
    <group>
      {/* Título no corredor, acima da porta de entrada — primeira impressão */}
      <TextPlane text="SONORA" width={4.6} x={20.27} y={4.45} z={0} rotY={Math.PI / 2} fontSize={150} letterSpacing={26} />
      <TextPlane text="MUSEU INTERATIVO DE TRILHAS SONORAS" width={3.9} x={20.27} y={3.92} z={0} rotY={Math.PI / 2} fontSize={58} color="#9db4cc" letterSpacing={10} glow="#8be9fd" />

      {/* Título flutuante no hall, visível ao atravessar a porta */}
      <TextPlane text="SONORA" width={11} x={15.6} y={6.1} z={0} rotY={Math.PI / 2} fontSize={150} letterSpacing={30} opacity={0.92} />

      {/* Identificação na parede do fundo do corredor */}
      <TextPlane text="BEM-VINDO" width={4.4} x={27.75} y={2.6} z={0} rotY={-Math.PI / 2} fontSize={110} color="#9db4cc" letterSpacing={22} />

      {/* Linhas de luz no rodapé das paredes do hall */}
      {[-9.78, 9.78].map((z) => (
        <mesh key={z} position={[0, 0.14, z]} material={trimCyan}>
          <boxGeometry args={[39.5, 0.05, 0.05]} />
        </mesh>
      ))}
      {[-19.78].map((x) => (
        <mesh key={x} position={[x, 0.14, 0]} rotation={[0, Math.PI / 2, 0]} material={trimCyan}>
          <boxGeometry args={[19.5, 0.05, 0.05]} />
        </mesh>
      ))}
    </group>
  );
}

export function Museum() {
  return (
    <group>
      <Walls />
      <Floors />
      <Ceilings />
      <Columns />
      <Signage />
    </group>
  );
}
