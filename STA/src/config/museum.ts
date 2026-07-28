import type { RoomId } from '../data/content';

// ─────────────────────────────────────────────────────────────────────────────
// PLANTA DO MUSEU (unidades em metros)
// Hall central 40×20 · 4 salas ao norte · 4 ao sul · Conclusão a oeste
// Corredor de entrada a leste
// ─────────────────────────────────────────────────────────────────────────────

export interface Wall {
  cx: number;
  cz: number;
  w: number; // tamanho em X
  d: number; // tamanho em Z
  h: number; // altura
}

export interface DoorDef {
  id: string;
  room: RoomId;
  x: number;
  z: number;
  axis: 'x' | 'z'; // direção em que a porta desliza
  width: number;
  label: string;
  accent: string;
}

export interface RoomZone {
  id: RoomId;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  ceiling: number;
  name: string;
  accent: string;
}

export const HALL_HEIGHT = 8;
export const ROOM_HEIGHT = 5;
export const WALL_T = 0.4;

export const SPAWN = { x: 26, y: 1.0, z: 0, yaw: Math.PI / 2 };

// ── Salas (zonas para detecção de posição) ────────────────────────────────────
export const ROOM_ZONES: RoomZone[] = [
  { id: 'corredor', minX: 20, maxX: 28, minZ: -4, maxZ: 4, ceiling: ROOM_HEIGHT, name: 'Entrada', accent: '#8be9fd' },
  { id: 'hall', minX: -20, maxX: 20, minZ: -10, maxZ: 10, ceiling: HALL_HEIGHT, name: 'Hall Principal', accent: '#8be9fd' },
  { id: 'origem', minX: -19.5, maxX: -10.5, minZ: 10, maxZ: 22, ceiling: ROOM_HEIGHT, name: 'Origem', accent: '#ffb454' },
  { id: 'historia', minX: -9.5, maxX: -0.5, minZ: 10, maxZ: 22, ceiling: ROOM_HEIGHT, name: 'História', accent: '#ff6b6b' },
  { id: 'evolucao', minX: 0.5, maxX: 9.5, minZ: 10, maxZ: 22, ceiling: ROOM_HEIGHT, name: 'Evolução', accent: '#4dd0e1' },
  { id: 'caracteristicas', minX: 10.5, maxX: 19.5, minZ: 10, maxZ: 22, ceiling: ROOM_HEIGHT, name: 'Características', accent: '#a78bfa' },
  { id: 'compositores', minX: -19.5, maxX: -10.5, minZ: -22, maxZ: -10, ceiling: ROOM_HEIGHT, name: 'Grandes Compositores', accent: '#fbbf24' },
  { id: 'exemplos', minX: -9.5, maxX: -0.5, minZ: -22, maxZ: -10, ceiling: ROOM_HEIGHT, name: 'Exemplos', accent: '#34d399' },
  { id: 'curiosidades', minX: 0.5, maxX: 9.5, minZ: -22, maxZ: -10, ceiling: ROOM_HEIGHT, name: 'Curiosidades', accent: '#f472b6' },
  { id: 'importancia', minX: 10.5, maxX: 19.5, minZ: -22, maxZ: -10, ceiling: ROOM_HEIGHT, name: 'Importância Cultural', accent: '#60a5fa' },
  { id: 'conclusao', minX: -32, maxX: -20, minZ: -7, maxZ: 7, ceiling: 6, name: 'Conclusão', accent: '#fb7185' },
];

const seg = (x1: number, x2: number, z1: number, z2: number, h: number): Wall => ({
  cx: (x1 + x2) / 2,
  cz: (z1 + z2) / 2,
  w: Math.max(Math.abs(x2 - x1), WALL_T),
  d: Math.max(Math.abs(z2 - z1), WALL_T),
  h,
});

// ── Paredes ───────────────────────────────────────────────────────────────────
export const WALLS: Wall[] = (() => {
  const walls: Wall[] = [];

  // Hall — parede norte (z = 10) com vãos de porta em x = -15, -5, 5, 15 (vão de 3 m)
  const northSegs: [number, number][] = [[-20, -16.5], [-13.5, -6.5], [-3.5, 3.5], [6.5, 13.5], [16.5, 20]];
  northSegs.forEach(([a, b]) => walls.push(seg(a, b, 10 - WALL_T / 2, 10 + WALL_T / 2, HALL_HEIGHT)));
  // Hall — parede sul (z = -10), espelhada
  northSegs.forEach(([a, b]) => walls.push(seg(a, b, -10 - WALL_T / 2, -10 + WALL_T / 2, HALL_HEIGHT)));
  // Hall — parede oeste (x = -20), vão da Conclusão em z = 0
  walls.push(seg(-20 - WALL_T / 2, -20 + WALL_T / 2, -10, -1.5, HALL_HEIGHT));
  walls.push(seg(-20 - WALL_T / 2, -20 + WALL_T / 2, 1.5, 10, HALL_HEIGHT));
  // Hall — parede leste (x = 20), vão de entrada de 4 m
  walls.push(seg(20 - WALL_T / 2, 20 + WALL_T / 2, -10, -2, HALL_HEIGHT));
  walls.push(seg(20 - WALL_T / 2, 20 + WALL_T / 2, 2, 10, HALL_HEIGHT));

  // Salas do norte: perímetro e divisórias
  walls.push(seg(-19.5, 19.5, 22 - WALL_T / 2, 22 + WALL_T / 2, ROOM_HEIGHT)); // fundo norte
  walls.push(seg(-19.5 - WALL_T / 2, -19.5 + WALL_T / 2, 10, 22, ROOM_HEIGHT)); // lateral oeste
  walls.push(seg(19.5 - WALL_T / 2, 19.5 + WALL_T / 2, 10, 22, ROOM_HEIGHT)); // lateral leste
  [-10, 0, 10].forEach((x) => walls.push(seg(x - 0.5, x + 0.5, 10, 22, ROOM_HEIGHT))); // divisórias

  // Salas do sul: perímetro e divisórias
  walls.push(seg(-19.5, 19.5, -22 - WALL_T / 2, -22 + WALL_T / 2, ROOM_HEIGHT));
  walls.push(seg(-19.5 - WALL_T / 2, -19.5 + WALL_T / 2, -22, -10, ROOM_HEIGHT));
  walls.push(seg(19.5 - WALL_T / 2, 19.5 + WALL_T / 2, -22, -10, ROOM_HEIGHT));
  [-10, 0, 10].forEach((x) => walls.push(seg(x - 0.5, x + 0.5, -22, -10, ROOM_HEIGHT)));

  // Sala Conclusão (oeste)
  walls.push(seg(-32 - WALL_T / 2, -32 + WALL_T / 2, -7, 7, 6));
  walls.push(seg(-32, -20, 7 - WALL_T / 2, 7 + WALL_T / 2, 6));
  walls.push(seg(-32, -20, -7 - WALL_T / 2, -7 + WALL_T / 2, 6));

  // Corredor de entrada
  walls.push(seg(20, 28, 4 - WALL_T / 2, 4 + WALL_T / 2, ROOM_HEIGHT));
  walls.push(seg(20, 28, -4 - WALL_T / 2, -4 + WALL_T / 2, ROOM_HEIGHT));
  walls.push(seg(28 - WALL_T / 2, 28 + WALL_T / 2, -4, 4, ROOM_HEIGHT));

  return walls;
})();

// ── Portas automáticas ────────────────────────────────────────────────────────
export const DOORS: DoorDef[] = [
  { id: 'door-entrada', room: 'hall', x: 20, z: 0, axis: 'z', width: 4, label: 'Hall Principal', accent: '#8be9fd' },
  { id: 'door-origem', room: 'origem', x: -15, z: 10, axis: 'x', width: 3, label: 'Origem', accent: '#ffb454' },
  { id: 'door-historia', room: 'historia', x: -5, z: 10, axis: 'x', width: 3, label: 'História', accent: '#ff6b6b' },
  { id: 'door-evolucao', room: 'evolucao', x: 5, z: 10, axis: 'x', width: 3, label: 'Evolução', accent: '#4dd0e1' },
  { id: 'door-caracteristicas', room: 'caracteristicas', x: 15, z: 10, axis: 'x', width: 3, label: 'Características', accent: '#a78bfa' },
  { id: 'door-compositores', room: 'compositores', x: -15, z: -10, axis: 'x', width: 3, label: 'Grandes Compositores', accent: '#fbbf24' },
  { id: 'door-exemplos', room: 'exemplos', x: -5, z: -10, axis: 'x', width: 3, label: 'Exemplos', accent: '#34d399' },
  { id: 'door-curiosidades', room: 'curiosidades', x: 5, z: -10, axis: 'x', width: 3, label: 'Curiosidades', accent: '#f472b6' },
  { id: 'door-importancia', room: 'importancia', x: 15, z: -10, axis: 'x', width: 3, label: 'Importância Cultural', accent: '#60a5fa' },
  { id: 'door-conclusao', room: 'conclusao', x: -20, z: 0, axis: 'z', width: 3, label: 'Conclusão', accent: '#fb7185' },
];

// ── Chão / teto ───────────────────────────────────────────────────────────────
export const FLOOR = { minX: -33, maxX: 29, minZ: -23, maxZ: 23 };

export function roomAt(x: number, z: number): RoomZone {
  for (const r of ROOM_ZONES) {
    if (x >= r.minX && x <= r.maxX && z >= r.minZ && z <= r.maxZ) return r;
  }
  return ROOM_ZONES[1]; // hall como padrão
}
