import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useMuseumStore } from '../../store/useMuseumStore';

const STATUS = [
  'Construindo o museu…',
  'Afinando a orquestra…',
  'Calibrando hologramas…',
  'Polindo os reflexos…',
  'Abrindo as portas…',
];

export function LoadingScreen() {
  const setPhase = useMuseumStore((s) => s.setPhase);
  const barRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState(STATUS[0]);

  useEffect(() => {
    const progress = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => setPhase('menu'),
    });

    tl.fromTo(
      logoRef.current,
      { opacity: 0, letterSpacing: '0.9em', filter: 'blur(10px)' },
      { opacity: 1, letterSpacing: '0.35em', filter: 'blur(0px)', duration: 1.4, ease: 'power3.out' },
      0,
    );

    STATUS.forEach((s, i) => {
      tl.call(() => setStatus(s), undefined, 0.3 + i * 0.55);
    });

    tl.to(
      progress,
      {
        v: 100,
        duration: 2.9,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (barRef.current) barRef.current.style.width = `${progress.v}%`;
        },
      },
      0.2,
    );

    tl.to({}, { duration: 0.35 }); // respiro antes do menu
    return () => { tl.kill(); };
  }, [setPhase]);

  return (
    <div className="boot">
      <div ref={logoRef} className="boot-logo">SONORA</div>
      <div className="boot-sub">Museu Interativo de Trilhas Sonoras</div>
      <div className="boot-bar"><div ref={barRef} className="boot-bar-fill" /></div>
      <div className="boot-status">{status}</div>
    </div>
  );
}
