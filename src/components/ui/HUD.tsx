import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMuseumStore } from '../../store/useMuseumStore';
import { ROOM_ZONES } from '../../config/museum';
import { TOTAL_ROOMS, HALL_INFO } from '../../data/content';
import { setMuted, sfx } from '../../audio/audioEngine';
import { unlockPointer } from './pointerLock';

function MapIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  );
}
function HelpIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function SoundIcon({ muted }: { muted: boolean }) {
  return muted ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 010 7.07" /><path d="M19.07 4.93a10 10 0 010 14.14" />
    </svg>
  );
}
function HomeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function HUD() {
  const currentRoom = useMuseumStore((s) => s.currentRoom);
  const visitedRooms = useMuseumStore((s) => s.visitedRooms);
  const interactPrompt = useMuseumStore((s) => s.interactPrompt);
  const toasts = useMuseumStore((s) => s.toasts);
  const setMapOpen = useMuseumStore((s) => s.setMapOpen);
  const setHelpOpen = useMuseumStore((s) => s.setHelpOpen);
  const muted = useMuseumStore((s) => s.muted);
  const toggleMuted = useMuseumStore((s) => s.toggleMuted);
  const setPhase = useMuseumStore((s) => s.setPhase);
  const pointerLocked = useMuseumStore((s) => s.pointerLocked);

  const [showHints, setShowHints] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setShowHints(false), 12000);
    return () => window.clearTimeout(t);
  }, []);

  const zone = ROOM_ZONES.find((z) => z.id === currentRoom);

  return (
    <div className="layer hud">
      {/* Sala atual + progresso */}
      <div className="hud-top-left">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoom}
            className="hud-room"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.35 }}
            style={{ color: zone?.accent ?? '#e8f0f8' }}
          >
            {zone?.name ?? HALL_INFO.title}
          </motion.div>
        </AnimatePresence>
        <div className="hud-progress">
          Salas exploradas: {visitedRooms.length} / {TOTAL_ROOMS}
        </div>
      </div>

      {/* Ações */}
      <div className="hud-top-right">
        <button className="icon-btn" title="Mapa (M)" onClick={() => { sfx.click(); setMapOpen(true); unlockPointer(); }}>
          <MapIcon /><span className="key-hint">M</span>
        </button>
        <button className="icon-btn" title="Ajuda (H)" onClick={() => { sfx.click(); setHelpOpen(true); unlockPointer(); }}>
          <HelpIcon /><span className="key-hint">H</span>
        </button>
        <button
          className="icon-btn"
          title={muted ? 'Ativar som' : 'Silenciar'}
          onClick={() => { toggleMuted(); setMuted(!muted); sfx.click(); }}
        >
          <SoundIcon muted={muted} />
        </button>
        <button className="icon-btn" title="Voltar ao menu" onClick={() => { sfx.click(); unlockPointer(); setPhase('menu'); }}>
          <HomeIcon />
        </button>
      </div>

      {/* Mira */}
      {pointerLocked && <div className="crosshair" />}

      {/* Prompt de interação */}
      <AnimatePresence>
        {interactPrompt && pointerLocked && (
          <motion.div
            className="interact-prompt"
            initial={{ opacity: 0, y: 14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.22 }}
          >
            <span className="key-chip">E</span>
            <span>{interactPrompt}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dicas de controles */}
      <div className="controls-hint" style={{ opacity: showHints ? 1 : 0 }}>
        <span><span className="mini-key">WASD</span> andar</span>
        <span><span className="mini-key">Shift</span> correr</span>
        <span><span className="mini-key">Espaço</span> pular</span>
        <span><span className="mini-key">E</span> interagir</span>
      </div>

      {/* Notificações */}
      <div className="toasts">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              className="toast"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.35 }}
            >
              <div className="toast-title">{t.title}</div>
              <div className="toast-message">{t.message}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
