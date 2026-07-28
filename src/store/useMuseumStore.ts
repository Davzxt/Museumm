import { create } from 'zustand';
import type { PanelData, RoomId } from '../data/content';

export type AppPhase = 'boot' | 'menu' | 'playing';

export interface ActivePanel {
  roomId: RoomId;
  panel: PanelData;
}

export interface SpeakerNotes {
  roomId: RoomId;
  roomName: string;
  notes: string[];
}

interface Toast {
  id: number;
  title: string;
  message: string;
}

interface MuseumState {
  phase: AppPhase;
  setPhase: (p: AppPhase) => void;

  pointerLocked: boolean;
  setPointerLocked: (v: boolean) => void;

  activePanel: ActivePanel | null;
  openPanel: (roomId: RoomId, panel: PanelData) => void;
  closePanel: () => void;

  speakerNotes: SpeakerNotes | null;
  openSpeakerNotes: (notes: SpeakerNotes) => void;
  closeSpeakerNotes: () => void;

  mapOpen: boolean;
  setMapOpen: (v: boolean) => void;
  helpOpen: boolean;
  setHelpOpen: (v: boolean) => void;

  muted: boolean;
  toggleMuted: () => void;

  currentRoom: RoomId;
  setCurrentRoom: (r: RoomId) => void;

  visitedRooms: RoomId[];
  markVisited: (r: RoomId) => void;

  playerPos: { x: number; z: number };
  setPlayerPos: (x: number, z: number) => void;

  interactPrompt: string | null;
  setInteractPrompt: (p: string | null) => void;

  toasts: Toast[];
  pushToast: (title: string, message: string) => void;
  dismissToast: (id: number) => void;

  startedAt: number;
}

export function anyOverlayOpen(): boolean {
  const s = useMuseumStore.getState();
  return !!(s.activePanel || s.speakerNotes || s.mapOpen || s.helpOpen);
}

let toastId = 0;

export const useMuseumStore = create<MuseumState>((set, get) => ({
  phase: 'boot',
  setPhase: (p) => set({ phase: p }),

  pointerLocked: false,
  setPointerLocked: (v) => set({ pointerLocked: v }),

  activePanel: null,
  openPanel: (roomId, panel) => set({ activePanel: { roomId, panel } }),
  closePanel: () => set({ activePanel: null }),

  speakerNotes: null,
  openSpeakerNotes: (notes) => set({ speakerNotes: notes }),
  closeSpeakerNotes: () => set({ speakerNotes: null }),

  mapOpen: false,
  setMapOpen: (v) => set({ mapOpen: v }),
  helpOpen: false,
  setHelpOpen: (v) => set({ helpOpen: v }),

  muted: false,
  toggleMuted: () => set((s) => ({ muted: !s.muted })),

  currentRoom: 'corredor' as RoomId,
  setCurrentRoom: (r) => set({ currentRoom: r }),

  visitedRooms: [],
  markVisited: (r) => {
    const { visitedRooms, pushToast } = get();
    if (r === 'hall' || r === 'corredor') return;
    if (!visitedRooms.includes(r)) {
      set({ visitedRooms: [...visitedRooms, r] });
      const total = 9;
      const count = visitedRooms.length + 1;
      pushToast(
        count >= total ? 'Museu completo!' : 'Nova sala descoberta',
        count >= total
          ? 'Você explorou todas as salas do museu. Parabéns!'
          : `Você explorou ${count} de ${total} salas.`,
      );
    }
  },

  playerPos: { x: 26, z: 0 },
  setPlayerPos: (x, z) => set({ playerPos: { x, z } }),

  interactPrompt: null,
  setInteractPrompt: (p) => set({ interactPrompt: p }),

  toasts: [],
  pushToast: (title, message) => {
    const id = ++toastId;
    set((s) => ({ toasts: [...s.toasts, { id, title, message }] }));
    window.setTimeout(() => get().dismissToast(id), 5200);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  startedAt: Date.now(),
}));
