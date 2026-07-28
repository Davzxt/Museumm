import { motion, AnimatePresence } from 'framer-motion';
import { useMuseumStore, anyOverlayOpen } from '../../store/useMuseumStore';

export function PauseOverlay() {
  const phase = useMuseumStore((s) => s.phase);
  const pointerLocked = useMuseumStore((s) => s.pointerLocked);
  const activePanel = useMuseumStore((s) => s.activePanel);
  const speakerNotes = useMuseumStore((s) => s.speakerNotes);
  const mapOpen = useMuseumStore((s) => s.mapOpen);
  const helpOpen = useMuseumStore((s) => s.helpOpen);

  const paused = phase === 'playing' && !pointerLocked && !anyOverlayOpen() && !activePanel && !speakerNotes && !mapOpen && !helpOpen;

  const resume = () => {
    const canvas = document.querySelector('canvas');
    canvas?.requestPointerLock();
  };

  return (
    <AnimatePresence>
      {paused && (
        <motion.div
          className="pause"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={resume}
        >
          <div className="pause-title">Pausado</div>
          <div className="pause-sub">Clique para continuar a visita</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
