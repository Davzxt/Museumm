import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMuseumStore } from '../../store/useMuseumStore';
import { ROOM_ZONES, DOORS } from '../../config/museum';
import { sfx } from '../../audio/audioEngine';
import { relockPointer } from './pointerLock';

// Mapa 2D do museu (vista superior) — coordenadas do mundo → SVG (y invertido)
export function MapOverlay() {
  const mapOpen = useMuseumStore((s) => s.mapOpen);
  const setMapOpen = useMuseumStore((s) => s.setMapOpen);
  const playerPos = useMuseumStore((s) => s.playerPos);
  const visitedRooms = useMuseumStore((s) => s.visitedRooms);
  const currentRoom = useMuseumStore((s) => s.currentRoom);

  const close = () => {
    sfx.close();
    setMapOpen(false);
    relockPointer();
  };

  useEffect(() => {
    if (!mapOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape' || e.code === 'KeyM') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapOpen]);

  return (
    <AnimatePresence>
      {mapOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={close}
        >
          <motion.div
            className="map-card"
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="map-header">
              <div className="map-title">Mapa do Museu</div>
              <div className="map-legend">
                <span><span className="legend-dot" style={{ background: '#8be9fd' }} />você</span>
                <span><span className="legend-dot" style={{ background: '#34d399' }} />explorada</span>
                <span><span className="legend-dot" style={{ background: '#5a6b84' }} />a explorar</span>
              </div>
            </div>

            <svg viewBox="-33.5 -23.5 63 47.5" style={{ width: '100%', display: 'block' }}>
              {/* Fundo */}
              <rect x="-33.5" y="-23.5" width="63" height="47.5" fill="#070b14" rx="1" />

              {/* Portas */}
              {DOORS.map((d) => (
                <rect
                  key={d.id}
                  x={d.axis === 'x' ? d.x - d.width / 2 : d.x - 0.35}
                  y={d.axis === 'x' ? d.z - 0.35 : d.z - d.width / 2}
                  width={d.axis === 'x' ? d.width : 0.7}
                  height={d.axis === 'x' ? 0.7 : d.width}
                  fill={d.accent}
                  opacity={0.85}
                />
              ))}

              {/* Salas */}
              {ROOM_ZONES.map((z) => {
                const visited = visitedRooms.includes(z.id);
                const current = currentRoom === z.id;
                const w = z.maxX - z.minX;
                const h = z.maxZ - z.minZ;
                const short = z.name.length > 14 ? z.name.slice(0, 13) + '…' : z.name;
                return (
                  <g key={z.id}>
                    <rect
                      x={z.minX}
                      y={z.minZ}
                      width={w}
                      height={h}
                      fill={visited ? `${z.accent}33` : '#101827'}
                      stroke={current ? '#ffffff' : z.accent}
                      strokeWidth={current ? 0.35 : 0.16}
                      rx="0.5"
                    />
                    <text
                      x={(z.minX + z.maxX) / 2}
                      y={(z.minZ + z.maxZ) / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={current ? '#ffffff' : '#9db4cc'}
                      fontSize={z.id === 'hall' ? 2.4 : 1.35}
                      fontWeight={700}
                      letterSpacing="0.12em"
                      style={{ textTransform: 'uppercase', pointerEvents: 'none' }}
                    >
                      {z.id === 'hall' || z.id === 'corredor' ? z.name : short}
                    </text>
                  </g>
                );
              })}

              {/* Jogador */}
              <circle cx={playerPos.x} cy={playerPos.z} r="1.1" fill="#8be9fd" opacity="0.25">
                <animate attributeName="r" values="0.9;1.6;0.9" dur="1.6s" repeatCount="indefinite" />
              </circle>
              <circle cx={playerPos.x} cy={playerPos.z} r="0.55" fill="#8be9fd" stroke="#04121a" strokeWidth="0.18" />
            </svg>

            <div style={{ marginTop: 12, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-dim)', textAlign: 'center' }}>
              Pressione M para fechar · a entrada fica à direita, a conclusão à esquerda
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
