import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMuseumStore } from '../../store/useMuseumStore';
import { sfx } from '../../audio/audioEngine';
import { relockPointer } from './pointerLock';

const CONTROLS: { key: string; label: string }[] = [
  { key: 'W A S D', label: 'Andar pelo museu' },
  { key: 'Mouse', label: 'Olhar ao redor' },
  { key: 'Shift', label: 'Correr' },
  { key: 'Espaço', label: 'Pular' },
  { key: 'E', label: 'Interagir com painéis e objetos' },
  { key: 'M', label: 'Abrir / fechar o mapa' },
  { key: 'H', label: 'Abrir / fechar esta ajuda' },
  { key: 'Esc', label: 'Pausar / liberar o mouse' },
];

export function HelpOverlay() {
  const helpOpen = useMuseumStore((s) => s.helpOpen);
  const setHelpOpen = useMuseumStore((s) => s.setHelpOpen);
  const phase = useMuseumStore((s) => s.phase);

  const close = () => {
    sfx.close();
    setHelpOpen(false);
    if (phase === 'playing') relockPointer();
  };

  useEffect(() => {
    if (!helpOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'KeyH') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [helpOpen, phase]);

  return (
    <AnimatePresence>
      {helpOpen && (
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
                <div className="modal-kicker">Guia do visitante</div>
                <div className="modal-title">Como explorar o museu</div>
                <div className="modal-subtitle">
                  Visite as 9 salas, leia os painéis holográficos e encontre os pontos de apresentação do grupo
                </div>
              </div>
              <button className="modal-close" onClick={close} title="Fechar (H)">✕</button>
            </div>
            <div className="modal-body">
              <div className="help-grid">
                {CONTROLS.map((c) => (
                  <div key={c.key} className="help-item">
                    <span className="key-chip">{c.key}</span>
                    <span className="help-item-text">{c.label}</span>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 6 }}>
                Dica: cada sala tem um <strong>círculo luminoso no chão</strong> — é o ponto de apresentação,
                com o roteiro que o grupo preparou para explicar o tema. Os painéis com símbolo de
                <strong> play</strong> tocam motivos musicais sintetizados na hora.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
