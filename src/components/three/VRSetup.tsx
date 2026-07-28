import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { createXRStore, XR, XRSpace, useXRInputSourceState } from '@react-three/xr';
import { useMuseumStore } from '../../store/useMuseumStore';

// Store XR global — compartilhado com UI (botão Enter VR)
export const xrStore = createXRStore({
  depthSensing: false,
  foveation: 1,
});

// Botão "Entrar em VR" — renderizado no menu principal
export function useVRButton() {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if ('xr' in navigator) {
      (navigator as any).xr?.isSessionSupported?.('immersive-vr').then((v: boolean) => setSupported(v)).catch(() => {});
    }
  }, []);

  const enterVR = () => {
    xrStore.enterVR();
  };

  return { supported, enterVR };
}

// Componente VR raiz — envolve a cena quando em VR
export function VRSetup() {
  return (
    <XR store={xrStore}>
      <VRLocomotion />
    </XR>
  );
}

// Locomoção VR: joystick do controller esquerdo para mover, botão A para teleport
const VR_SPEED = 3.5;
const TELEPORT_DIST = 8;

function VRLocomotion() {
  const { camera } = useThree();
  const lastTeleport = useRef(0);
  const phase = useMuseumStore((s) => s.phase);

  // Lê estado dos controllers
  const leftHand = useXRInputSourceState('hand', 'left');
  const rightHand = useXRInputSourceState('hand', 'right');

  useFrame((_, delta) => {
    if (phase !== 'playing') return;

    // Movimento via thumbstick esquerdo
    const left = leftHand as any;
    if (left?.inputState?.thumbstick) {
      const x = left.inputState.thumbstick.x || 0;
      const y = left.inputState.thumbstick.y || 0;
      if (Math.abs(x) > 0.1 || Math.abs(y) > 0.1) {
        // Direção baseada na orientação do headset
        const dir = new THREE.Vector3(x, 0, -y).multiplyScalar(VR_SPEED * delta);
        dir.applyQuaternion(new THREE.Quaternion().setFromEuler(
          new THREE.Euler(0, camera.rotation.y, 0, 'YXZ')
        ));
        camera.position.add(dir);
      }
    }

    // Teleport via botão do thumbstick direito ou botão A
    const right = rightHand as any;
    if (right?.inputState?.thumbstick) {
      const ry = right.inputState.thumbstick.y || 0;
      if (ry < -0.8 && Date.now() - lastTeleport.current > 1500) {
        lastTeleport.current = Date.now();
        // Teleporta para frente
        const fwd = new THREE.Vector3(0, 0, -TELEPORT_DIST);
        fwd.applyQuaternion(new THREE.Quaternion().setFromEuler(
          new THREE.Euler(0, camera.rotation.y, 0, 'YXZ')
        ));
        camera.position.add(fwd);
        camera.position.y = 1.7; // Mantém altura do chão
      }
    }
  });

  return null;
}
