import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMuseumStore } from '../../store/useMuseumStore';
import { sfx } from '../../audio/audioEngine';
import { relockPointer } from './pointerLock';

export function SpeakerModal() {
  const speakerNotes = useMuseumStore((s) => s.speakerNotes);
  const closeSpeakerNotes = useMuseumStore((s) => s.closeSpeakerNotes);

  const close = () => {
    sfx.close();
    closeSpeakerNotes();
    relockPointer();
  };

  useEffect(() => {
    if (!speakerNotes) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'KeyE') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speakerNotes]);

  return (
    <AnimatePresence>
      {speakerNotes && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={close}
        >
          <motion.div
            className="modal"
            initial={{ opacity: 0, y: 34, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-accent-bar" />
            <div className="modal-header">
              <div>
                <div className="modal-kicker">Roteiro de apresentação</div>
                <div className="modal-title">{speakerNotes.roomName}</div>
                <div className="modal-subtitle">Sugestões de fala para o grupo — apenas apresentadores veem isto</div>
              </div>
              <button className="modal-close" onClick={close} title="Fechar (E)">✕</button>
            </div>
            <div className="modal-body">
              <div className="notes-list">
                {speakerNotes.notes.map((n, i) => (
                  <div key={i} className="note-item">{n}</div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
