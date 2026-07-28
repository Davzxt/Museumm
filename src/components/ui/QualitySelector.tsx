import { useState } from 'react';
import { useQualityStore, type QualityPreset } from '../../store/useQualityStore';

const LABELS: Record<QualityPreset, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  ultra: 'Ultra',
};

const ICONS: Record<QualityPreset, string> = {
  low: '⚡',
  medium: '🔋',
  high: '🎮',
  ultra: '✨',
};

// Seletor de qualidade — botão no HUD + menu de opções
export function QualitySelector() {
  const [open, setOpen] = useState(false);
  const settings = useQualityStore((s) => s.settings);
  const setPreset = useQualityStore((s) => s.setPreset);
  const current = settings.preset;

  return (
    <div className="quality-selector">
      <button
        className="quality-toggle"
        onClick={() => setOpen(!open)}
        title="Qualidade gráfica"
      >
        {ICONS[current]} {LABELS[current]}
      </button>
      {open && (
        <div className="quality-menu">
          <div className="quality-menu-title">Qualidade Gráfica</div>
          {(['low', 'medium', 'high', 'ultra'] as QualityPreset[]).map((p) => (
            <button
              key={p}
              className={`quality-option ${current === p ? 'active' : ''}`}
              onClick={() => { setPreset(p); setOpen(false); }}
            >
              <span className="quality-icon">{ICONS[p]}</span>
              <span className="quality-label">{LABELS[p]}</span>
              {p === 'low' && <span className="quality-desc">Máximo desempenho</span>}
              {p === 'medium' && <span className="quality-desc">Balanceado</span>}
              {p === 'high' && <span className="quality-desc">Visual rico</span>}
              {p === 'ultra' && <span className="quality-desc">Máximo visual</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
