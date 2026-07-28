import { useEffect } from 'react';
import { useMuseumStore, anyOverlayOpen } from '../../store/useMuseumStore';
import { sfx } from '../../audio/audioEngine';
import { unlockPointer, relockPointer } from './pointerLock';

// Atalhos globais de teclado (M = mapa, H = ajuda)
export function KeyboardController() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = useMuseumStore.getState();
      if (s.phase !== 'playing') return;

      // Não intercepta teclas quando um painel de leitura está aberto
      if (s.activePanel || s.speakerNotes) return;

      if (e.code === 'KeyM') {
        if (s.mapOpen) {
          s.setMapOpen(false);
          sfx.close();
          relockPointer();
        } else if (!anyOverlayOpen()) {
          s.setMapOpen(true);
          sfx.open();
          unlockPointer();
        }
      }

      if (e.code === 'KeyH') {
        if (s.helpOpen) {
          s.setHelpOpen(false);
          sfx.close();
          relockPointer();
        } else if (!anyOverlayOpen()) {
          s.setHelpOpen(true);
          sfx.open();
          unlockPointer();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return null;
}
