import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMuseumStore } from '../../store/useMuseumStore';
import { ROOMS } from '../../data/content';
import { playMotif, stopMotif, sfx } from '../../audio/audioEngine';
import { relockPointer } from './pointerLock';

export function PanelModal() {
  const activePanel = useMuseumStore((s) => s.activePanel);
  const closePanel = useMuseumStore((s) => s.closePanel);
  const [playing, setPlaying] = useState(false);

  const close = () => {
    stopMotif();
    setPlaying(false);
    sfx.close();
    closePanel();
    relockPointer();
  };

  useEffect(() => {
    if (!activePanel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'KeyE') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePanel]);

  useEffect(() => () => stopMotif(), []);

  const room = activePanel && activePanel.roomId !== 'hall' && activePanel.roomId !== 'corredor'
    ? ROOMS[activePanel.roomId]
    : null;

  return (
    <AnimatePresence>
      {activePanel && (
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
            <div className="modal-accent-bar" style={{ background: `linear-gradient(90deg, ${room?.accent ?? '#8be9fd'}, transparent)` }} />
            <div className="modal-header">
              <div>
                <div className="modal-kicker" style={{ color: room?.accent ?? '#8be9fd' }}>
                  {room?.name ?? 'Museu'}
                </div>
                <div className="modal-title">{activePanel.panel.title}</div>
                {activePanel.panel.subtitle && (
                  <div className="modal-subtitle">{activePanel.panel.subtitle}</div>
                )}
              </div>
              <button className="modal-close" onClick={close} title="Fechar (E)">✕</button>
            </div>

            <div className="modal-body">
              {activePanel.panel.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}

              {activePanel.panel.highlights && (
                <div className="highlights">
                  {activePanel.panel.highlights.map((h, i) => (
                    <span key={i} className="highlight-chip" style={{ borderColor: `${room?.accent ?? '#8be9fd'}55`, color: room?.accent ?? '#8be9fd' }}>
                      {h}
                    </span>
                  ))}
                </div>
              )}

              {activePanel.panel.motif && (
                <div className="motif-player">
                  <button
                    className="motif-btn"
                    onClick={() => {
                      if (playing) {
                        stopMotif();
                        setPlaying(false);
                      } else {
                        playMotif(activePanel.panel.motif!.notes);
                        setPlaying(true);
                        const total = Math.max(...activePanel.panel.motif!.notes.map((n) => n.time + n.dur)) * 1000 + 400;
                        window.setTimeout(() => setPlaying(false), total);
                      }
                    }}
                  >
                    {playing ? '■' : '▶'}
                  </button>
                  <div>
                    <div className="motif-label">{activePanel.panel.motif.label}</div>
                    <div className="motif-hint">Interpretação sintetizada gerada em tempo real</div>
                  </div>
                </div>
              )}

              {activePanel.panel.video && (
                <div className="video-frame">
                  <iframe
                    src={`https://www.youtube.com/embed/${activePanel.panel.video.youtubeId}`}
                    title={activePanel.panel.video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
