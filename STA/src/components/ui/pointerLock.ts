// Utilitário para reentrar em pointer lock após fechar overlays
export function relockPointer(): void {
  window.setTimeout(() => {
    const canvas = document.querySelector('canvas');
    if (canvas && document.pointerLockElement !== canvas) {
      try {
        const p = canvas.requestPointerLock() as unknown as Promise<void> | undefined;
        p?.catch?.(() => { /* usuário pode clicar para retomar */ });
      } catch { /* navegador exigirá gesto do usuário */ }
    }
  }, 80);
}

export function unlockPointer(): void {
  if (document.pointerLockElement) document.exitPointerLock();
}
