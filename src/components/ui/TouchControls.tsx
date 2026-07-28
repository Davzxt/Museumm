import { useEffect, useRef, useCallback } from 'react';
import { useMuseumStore, anyOverlayOpen } from '../../store/useMuseumStore';

// Joystick virtual + botões de ação para mobile/touch
export function TouchControls() {
  const joyRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const activeTouch = useRef<number | null>(null);
  const joyCenter = useRef({ x: 0, y: 0 });
  const moveVec = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Expor o vetor de movimento para o Player ler
    (window as any).__touchMove = moveVec.current;
    return () => { delete (window as any).__touchMove; };
  }, []);

  const onJoyStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    const rect = joyRef.current?.getBoundingClientRect();
    if (!rect) return;
    activeTouch.current = t.identifier;
    joyCenter.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }, []);

  const onJoyMove = useCallback((e: React.TouchEvent) => {
    for (let i = 0; i < e.touches.length; i++) {
      const t = e.touches[i];
      if (t.identifier === activeTouch.current) {
        const dx = t.clientX - joyCenter.current.x;
        const dy = t.clientY - joyCenter.current.y;
        const maxR = 40;
        const dist = Math.min(Math.hypot(dx, dy), maxR);
        const angle = Math.atan2(dy, dx);
        const nx = Math.cos(angle) * dist;
        const ny = Math.sin(angle) * dist;
        if (knobRef.current) {
          knobRef.current.style.transform = `translate(${nx}px, ${ny}px)`;
        }
        moveVec.current.x = nx / maxR;
        moveVec.current.y = ny / maxR;
      }
    }
  }, []);

  const onJoyEnd = useCallback(() => {
    activeTouch.current = null;
    moveVec.current.x = 0;
    moveVec.current.y = 0;
    if (knobRef.current) {
      knobRef.current.style.transform = 'translate(0px, 0px)';
    }
  }, []);

  const handleInteract = useCallback(() => {
    const s = useMuseumStore.getState();
    if (s.phase === 'playing' && !anyOverlayOpen()) {
      // Simula tecla E
      window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyE' }));
      setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyE' })), 50);
    }
  }, []);

  const handleJump = useCallback(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
    setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space' })), 50);
  }, []);

  const handleRun = useCallback(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ShiftLeft' }));
  }, []);

  const handleRunEnd = useCallback(() => {
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ShiftLeft' }));
  }, []);

  return (
    <div className="touch-controls">
      {/* Joystick esquerdo */}
      <div
        ref={joyRef}
        className="touch-joystick"
        onTouchStart={onJoyStart}
        onTouchMove={onJoyMove}
        onTouchEnd={onJoyEnd}
        onTouchCancel={onJoyEnd}
      >
        <div ref={knobRef} className="touch-knob" />
      </div>

      {/* Botões direitos */}
      <div className="touch-buttons">
        <button className="touch-btn touch-btn-jump" onTouchStart={handleJump}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
        <button className="touch-btn touch-btn-interact" onTouchStart={handleInteract}>
          E
        </button>
        <button
          className="touch-btn touch-btn-run"
          onTouchStart={handleRun}
          onTouchEnd={handleRunEnd}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
