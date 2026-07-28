import { motion } from 'framer-motion';
import { useMuseumStore } from '../../store/useMuseumStore';
import { startAudio, setMuted, sfx } from '../../audio/audioEngine';
import { relockPointer } from './pointerLock';
import { useVRButton } from '../three/VRSetup';

export function MainMenu() {
  const setPhase = useMuseumStore((s) => s.setPhase);
  const setHelpOpen = useMuseumStore((s) => s.setHelpOpen);
  const muted = useMuseumStore((s) => s.muted);
  const vr = useVRButton();

  const enter = () => {
    sfx.click();
    startAudio();
    setMuted(muted);
    setPhase('playing');
    relockPointer();
  };

  return (
    <motion.div
      className="menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9 }}
    >
      <motion.div
        className="menu-kicker"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.7 }}
      >
        Um projeto de Artes
      </motion.div>

      <motion.div
        className="menu-title"
        initial={{ opacity: 0, scale: 0.94, filter: 'blur(12px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ delay: 0.4, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        SONORA
      </motion.div>

      <motion.div
        className="menu-sub"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7 }}
      >
        Museu Interativo de Trilhas Sonoras
      </motion.div>

      <motion.div
        className="menu-buttons"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95, duration: 0.7 }}
      >
        <button className="btn btn-primary" onClick={enter} onMouseEnter={() => sfx.hover()}>
          Iniciar visita
        </button>
        {vr.supported && (
          <button className="btn btn-vr" onClick={() => { sfx.click(); startAudio(); setPhase('playing'); vr.enterVR(); }} onMouseEnter={() => sfx.hover()}>
            🥽 Entrar em VR
          </button>
        )}
        <button className="btn" onClick={() => { sfx.click(); setHelpOpen(true); }} onMouseEnter={() => sfx.hover()}>
          Como explorar
        </button>
      </motion.div>

      <div className="menu-footer">
        9 salas · painéis interativos · áudio espacial
        <br />
        fone de ouvido recomendado para a melhor experiência
      </div>
    </motion.div>
  );
}
