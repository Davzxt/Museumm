import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ROOMS, type PanelData, type RoomData, type RoomId } from '../../data/content';
import { ROOM_ZONES, type RoomZone } from '../../config/museum';
import { makeTextTexture } from './textTexture';
import { registerInteractable } from './interactables';
import { useMuseumStore } from '../../store/useMuseumStore';
import { sfx } from '../../audio/audioEngine';
import { Exhibit } from './Exhibits';

// ── Posição das paredes de cada sala ──────────────────────────────────────────
interface Placement {
  pos: [number, number, number];
  rotY: number;
}

function panelPlacements(zone: RoomZone, count: number): Placement[] {
  const cx = (zone.minX + zone.maxX) / 2;
  const cz = (zone.minZ + zone.maxZ) / 2;
  const placements: Placement[] = [];
  const isConclusao = zone.id === 'conclusao';
  const isNorth = zone.maxZ >= 22;

  // Parede de fundo (3 primeiros painéis)
  const backOffsets = [-2.6, 0, 2.6];
  for (let i = 0; i < Math.min(3, count); i++) {
    if (isConclusao) {
      placements.push({ pos: [zone.minX + 0.24, 1.85, cz + backOffsets[i] * 1.3], rotY: Math.PI / 2 });
    } else if (isNorth) {
      placements.push({ pos: [cx + backOffsets[i], 1.85, zone.maxZ - 0.24], rotY: Math.PI });
    } else {
      placements.push({ pos: [cx + backOffsets[i], 1.85, zone.minZ + 0.24], rotY: 0 });
    }
  }

  // Paredes laterais (painéis extras), alternando lados
  for (let i = 3; i < count; i++) {
    const side = (i - 3) % 2 === 0 ? 1 : -1;
    const depth = 2.4 - Math.floor((i - 3) / 2) * 2.2;
    if (isConclusao) {
      const z = side > 0 ? zone.maxZ - 0.24 : zone.minZ + 0.24;
      placements.push({ pos: [zone.minX + 2 + (i - 3) * 2.4, 1.85, z], rotY: side > 0 ? Math.PI : 0 });
    } else if (isNorth) {
      const x = side > 0 ? zone.maxX - 0.24 : zone.minX + 0.24;
      placements.push({ pos: [x, 1.85, zone.maxZ - depth - 1], rotY: side > 0 ? -Math.PI / 2 : Math.PI / 2 });
    } else {
      const x = side > 0 ? zone.maxX - 0.24 : zone.minX + 0.24;
      placements.push({ pos: [x, 1.85, zone.minZ + depth + 1], rotY: side > 0 ? -Math.PI / 2 : Math.PI / 2 });
    }
  }
  return placements;
}

// ── Painel holográfico ────────────────────────────────────────────────────────
function HoloPanel({ room, panel, placement }: { room: RoomData; panel: PanelData; placement: Placement }) {
  const borderMat = useRef<THREE.MeshStandardMaterial>(null);
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    return registerInteractable({
      id: `panel-${panel.id}`,
      position: placement.pos,
      radius: 2.4,
      prompt: `Ler: ${panel.title}`,
      action: () => {
        sfx.open();
        useMuseumStore.getState().openPanel(room.id, panel);
        document.exitPointerLock();
      },
    });
  }, [room.id, panel, placement.pos]);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (borderMat.current) borderMat.current.emissiveIntensity = 1.6 + Math.sin(t * 1.8) * 0.5;
  });

  const { titleTex, titleAspect } = useMemo(() => {
    const { texture, aspect } = makeTextTexture({ text: panel.title.toUpperCase(), fontSize: 72, color: '#ffffff', glow: room.accent, letterSpacing: 4 });
    return { titleTex: texture, titleAspect: aspect };
  }, [panel.title, room.accent]);

  const { subTex, subAspect } = useMemo(() => {
    if (!panel.subtitle) return { subTex: null, subAspect: 1 };
    const { texture, aspect } = makeTextTexture({ text: panel.subtitle, fontSize: 52, color: '#a9c6de', letterSpacing: 3 });
    return { subTex: texture, subAspect: aspect };
  }, [panel.subtitle]);

  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: room.accent,
        transparent: true,
        opacity: 0.1,
        roughness: 0.1,
        metalness: 0.2,
        envMapIntensity: 1.4,
        side: THREE.DoubleSide,
      }),
    [room.accent],
  );

  const W = 2.35;
  const H = 1.5;
  const titleW = Math.min(2.1, 0.34 * titleAspect * 0.34);

  return (
    <group ref={group} position={placement.pos} rotation={[0, placement.rotY, 0]}>
      {/* Vidro */}
      <mesh material={glassMat}>
        <planeGeometry args={[W, H]} />
      </mesh>
      {/* Moldura emissiva */}
      <mesh position={[0, H / 2, 0.005]}>
        <boxGeometry args={[W + 0.06, 0.03, 0.01]} />
        <meshStandardMaterial ref={borderMat} color="#0b101c" emissive={room.accent} emissiveIntensity={1.8} roughness={0.4} />
      </mesh>
      <mesh position={[0, -H / 2, 0.005]}>
        <boxGeometry args={[W + 0.06, 0.03, 0.01]} />
        <meshStandardMaterial color="#0b101c" emissive={room.accent} emissiveIntensity={0.9} roughness={0.4} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * W) / 2, 0, 0.005]}>
          <boxGeometry args={[0.03, H + 0.06, 0.01]} />
          <meshStandardMaterial color="#0b101c" emissive={room.accent} emissiveIntensity={0.9} roughness={0.4} />
        </mesh>
      ))}

      {/* Título */}
      <mesh position={[0, H / 2 - 0.26, 0.01]}>
        <planeGeometry args={[titleW, titleW / titleAspect]} />
        <meshBasicMaterial map={titleTex} transparent depthWrite={false} />
      </mesh>
      {/* Subtítulo */}
      {subTex && (
        <mesh position={[0, H / 2 - 0.52, 0.01]}>
          <planeGeometry args={[1.5, 1.5 / subAspect]} />
          <meshBasicMaterial map={subTex} transparent depthWrite={false} opacity={0.9} />
        </mesh>
      )}
      {/* Linhas decorativas de "texto" */}
      {[0.22, 0.05, -0.12].map((y, i) => (
        <mesh key={i} position={[0, y, 0.008]}>
          <planeGeometry args={[W * (0.72 - i * 0.12), 0.035]} />
          <meshBasicMaterial color={room.accent} transparent opacity={0.35} />
        </mesh>
      ))}
      {/* Chip "interaja" */}
      <mesh position={[0, -H / 2 + 0.16, 0.01]}>
        <planeGeometry args={[0.9, 0.1]} />
        <meshBasicMaterial color={room.accent} transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

// ── Ponto de apresentação do grupo ────────────────────────────────────────────
function SpeakerSpot({ room, position }: { room: RoomData; position: [number, number] }) {
  const ring = useRef<THREE.Mesh>(null);

  useEffect(() => {
    return registerInteractable({
      id: `speaker-${room.id}`,
      position: [position[0], 0.6, position[1]],
      radius: 2.2,
      prompt: 'Roteiro de apresentação do grupo',
      action: () => {
        sfx.open();
        useMuseumStore.getState().openSpeakerNotes({
          roomId: room.id,
          roomName: room.name,
          notes: room.speakerNotes,
        });
        document.exitPointerLock();
      },
    });
  }, [room, position]);

  useFrame((s) => {
    if (ring.current) {
      const m = ring.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.55 + Math.sin(s.clock.elapsedTime * 2.2) * 0.25;
      ring.current.rotation.z = s.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group position={[position[0], 0.02, position[1]]}>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.72, 40]} />
        <meshBasicMaterial color={room.accent} transparent opacity={0.7} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial color={room.accent} transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ── Título da sala na parede de fundo ─────────────────────────────────────────
function RoomTitle({ room, zone, index }: { room: RoomData; zone: RoomZone; index: number }) {
  const isConclusao = zone.id === 'conclusao';
  const isNorth = zone.maxZ >= 22;
  const { texture, aspect } = useMemo(
    () => makeTextTexture({ text: room.name.toUpperCase(), fontSize: 120, color: '#ffffff', glow: room.accent, letterSpacing: 16 }),
    [room.name, room.accent],
  );
  const { texture: numTex, aspect: numAspect } = useMemo(
    () => makeTextTexture({ text: `SALA ${String(index + 1).padStart(2, '0')}`, fontSize: 64, color: room.accent, letterSpacing: 10 }),
    [index, room.accent],
  );
  const w = 5.6;

  let pos: [number, number, number];
  let rotY: number;
  if (isConclusao) {
    pos = [zone.minX + 0.22, 3.9, (zone.minZ + zone.maxZ) / 2];
    rotY = Math.PI / 2;
  } else if (isNorth) {
    pos = [(zone.minX + zone.maxX) / 2, 3.7, zone.maxZ - 0.22];
    rotY = Math.PI;
  } else {
    pos = [(zone.minX + zone.maxX) / 2, 3.7, zone.minZ + 0.22];
    rotY = 0;
  }

  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <mesh>
        <planeGeometry args={[w, w / aspect]} />
        <meshBasicMaterial map={texture} transparent depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.75, 0.005]}>
        <planeGeometry args={[1.8, 1.8 / numAspect]} />
        <meshBasicMaterial map={numTex} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

// ── Sala completa ─────────────────────────────────────────────────────────────
function Room({ room, zone, index }: { room: RoomData; zone: RoomZone; index: number }) {
  const placements = useMemo(() => panelPlacements(zone, room.panels.length), [zone, room.panels.length]);
  const cx = (zone.minX + zone.maxX) / 2;
  const cz = (zone.minZ + zone.maxZ) / 2;
  const isConclusao = zone.id === 'conclusao';
  const isNorth = zone.maxZ >= 22;

  // Escultura um pouco atrás do centro; ponto de fala mais perto da porta
  const exhibitPos: [number, number, number] = isConclusao ? [cx - 1.5, 0, cz] : [cx, 0, cz + (isNorth ? 1.6 : -1.6)];
  const speakerPos: [number, number] = isConclusao ? [cx + 2.4, cz] : [cx, cz + (isNorth ? -2.6 : 2.6)];

  return (
    <group>
      <RoomTitle room={room} zone={zone} index={index} />
      {room.panels.map((p, i) => (
        <HoloPanel key={p.id} room={room} panel={p} placement={placements[i]} />
      ))}
      <Exhibit roomId={room.id} accent={room.accent} position={exhibitPos} />
      <SpeakerSpot room={room} position={speakerPos} />
      <pointLight position={[cx, zone.ceiling - 1.1, cz]} intensity={15} color={room.accent} distance={14} decay={1.9} />
      <pointLight position={[cx, 2.4, cz]} intensity={7} color="#dff2ff" distance={10} decay={1.9} />
    </group>
  );
}

export function Rooms() {
  const rooms = useMemo(
    () =>
      (Object.keys(ROOMS) as RoomId[]).map((id, i) => ({
        room: ROOMS[id as keyof typeof ROOMS],
        zone: ROOM_ZONES.find((z) => z.id === id)!,
        index: i,
      })),
    [],
  );
  return (
    <group>
      {rooms.map(({ room, zone, index }) => (
        <Room key={room.id} room={room} zone={zone} index={index} />
      ))}
    </group>
  );
}
