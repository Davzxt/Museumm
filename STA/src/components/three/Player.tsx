import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, useRapier, type RapierRigidBody } from '@react-three/rapier';
import { SPAWN, roomAt } from '../../config/museum';
import { ROOM_ZONES } from '../../config/museum';
import { getInteractables, type Interactable } from './interactables';
import { useMuseumStore, anyOverlayOpen } from '../../store/useMuseumStore';
import { updateListener, createRoomPad, audioStarted, sfx } from '../../audio/audioEngine';

const EYE = 0.78;
const WALK = 4.3;
const RUN = 7.6;
const JUMP = 6.4;
const SENS = 0.0023;

let padsCreated = false;

export function Player() {
  const body = useRef<RapierRigidBody>(null);
  const { camera, gl } = useThree();
  const { world, rapier } = useRapier();

  const yaw = useRef(SPAWN.yaw);
  const pitch = useRef(0);
  const keys = useRef<Record<string, boolean>>({});
  const bobPhase = useRef(0);
  const current = useRef<Interactable | null>(null);
  const lastRoom = useRef<string>('corredor');
  const posTimer = useRef(0);

  // ── Pointer lock + teclado ──────────────────────────────────────────────────
  useEffect(() => {
    const dom = gl.domElement;

    const onClick = () => {
      const s = useMuseumStore.getState();
      if (s.phase === 'playing' && !s.pointerLocked && !anyOverlayOpen()) {
        dom.requestPointerLock();
      }
    };
    const onLockChange = () => {
      useMuseumStore.getState().setPointerLocked(document.pointerLockElement === dom);
    };
    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== dom) return;
      yaw.current -= e.movementX * SENS;
      pitch.current = THREE.MathUtils.clamp(pitch.current - e.movementY * SENS, -1.45, 1.45);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (e.code === 'KeyE') {
        const s = useMuseumStore.getState();
        if (s.phase === 'playing' && s.pointerLocked && !anyOverlayOpen() && current.current) {
          current.current.action();
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => { keys.current[e.code] = false; };

    dom.addEventListener('click', onClick);
    document.addEventListener('pointerlockchange', onLockChange);
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      dom.removeEventListener('click', onClick);
      document.removeEventListener('pointerlockchange', onLockChange);
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [gl]);

  // ── Loop principal ──────────────────────────────────────────────────────────
  useFrame((state, delta) => {
    const s = useMuseumStore.getState();
    const t = state.clock.elapsedTime;

    // Câmera cinematográfica no menu/boot: órbita lenta ao redor da escultura
    if (s.phase !== 'playing') {
      const a = t * 0.07;
      camera.position.set(Math.cos(a) * 11.5, 3.4 + Math.sin(t * 0.16) * 0.5, Math.sin(a) * 11.5);
      camera.lookAt(0, 2.3, 0);
      return;
    }

    if (!body.current) return;
    const pos = body.current.translation();

    // Pads espaciais (uma vez, após o áudio iniciar)
    if (!padsCreated && audioStarted()) {
      ROOM_ZONES.forEach((z) => {
        createRoomPad(z.id, (z.minX + z.maxX) / 2, 2, (z.minZ + z.maxZ) / 2);
      });
      padsCreated = true;
    }

    const canMove = s.pointerLocked && !anyOverlayOpen();
    const vy = body.current.linvel().y;

    // Direção a partir do mouse
    const sinY = Math.sin(yaw.current);
    const cosY = Math.cos(yaw.current);
    let mx = 0;
    let mz = 0;

    if (canMove) {
      const fwd = (keys.current.KeyW ? 1 : 0) - (keys.current.KeyS ? 1 : 0);
      const side = (keys.current.KeyD ? 1 : 0) - (keys.current.KeyA ? 1 : 0);
      const fx = -sinY;
      const fz = -cosY;
      const rx = cosY;
      const rz = -sinY;
      mx = fx * fwd + rx * side;
      mz = fz * fwd + rz * side;
      const len = Math.hypot(mx, mz) || 1;
      const speed = keys.current.ShiftLeft || keys.current.ShiftRight ? RUN : WALK;
      mx = (mx / len) * speed * (fwd || side ? 1 : 0);
      mz = (mz / len) * speed * (fwd || side ? 1 : 0);

      // Pulo (com checagem de chão)
      if (keys.current.Space) {
        const ray = new rapier.Ray({ x: pos.x, y: pos.y, z: pos.z }, { x: 0, y: -1, z: 0 });
        const hit = world.castRay(ray, 1.08, true, undefined, undefined, undefined, body.current);
        if (hit) {
          body.current.setLinvel({ x: mx, y: JUMP, z: mz }, true);
          keys.current.Space = false;
        }
      }
    }

    if (canMove && (mx !== 0 || mz !== 0)) {
      body.current.setLinvel({ x: mx, y: vy, z: mz }, true);
    } else {
      body.current.setLinvel({ x: 0, y: vy, z: 0 }, true);
    }

    // Head-bob sutil ao andar
    const moving = canMove && (mx !== 0 || mz !== 0);
    if (moving) bobPhase.current += delta * 9;
    const bob = moving ? Math.sin(bobPhase.current) * 0.035 : 0;

    // Câmera = posição dos olhos
    camera.position.set(pos.x, pos.y + EYE + bob, pos.z);
    camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ');

    // Áudio espacial — ouvinte
    updateListener(pos.x, pos.y + EYE, pos.z, -sinY, -cosY);

    // Posição no mapa + detecção de sala (10 Hz)
    posTimer.current += delta;
    if (posTimer.current > 0.1) {
      posTimer.current = 0;
      s.setPlayerPos(pos.x, pos.z);
      const zone = roomAt(pos.x, pos.z);
      if (zone.id !== lastRoom.current) {
        lastRoom.current = zone.id;
        s.setCurrentRoom(zone.id);
        if (zone.id !== 'hall' && zone.id !== 'corredor' && !s.visitedRooms.includes(zone.id)) {
          s.markVisited(zone.id);
          sfx.discover();
        }
      }
    }

    // Interação: objeto mais próximo e à frente
    let best: Interactable | null = null;
    let bestScore = Infinity;
    if (s.pointerLocked && !anyOverlayOpen()) {
      const fx = -sinY;
      const fz = -cosY;
      for (const it of getInteractables()) {
        const dx = it.position[0] - pos.x;
        const dy = it.position[1] - (pos.y + EYE);
        const dz = it.position[2] - pos.z;
        const dist = Math.hypot(dx, dy, dz);
        if (dist > it.radius) continue;
        const dot = (dx * fx + dz * fz) / (Math.hypot(dx, dz) || 1);
        if (dot < 0.25 && dist > 1.1) continue;
        const score = dist - dot;
        if (score < bestScore) { bestScore = score; best = it; }
      }
    }
    if (best !== current.current) {
      current.current = best;
      s.setInteractPrompt(best ? best.prompt : null);
      if (best) sfx.hover();
    }
  });

  return (
    <RigidBody
      ref={body}
      colliders={false}
      position={[SPAWN.x, 1.0, SPAWN.z]}
      enabledRotations={[false, false, false]}
      linearDamping={0}
      friction={0}
      ccd
    >
      <CapsuleCollider args={[0.55, 0.35]} />
    </RigidBody>
  );
}
