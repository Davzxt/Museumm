// Registro global de objetos interagíveis do museu.
// Componentes 3D se registram; o Player consulta o mais próximo a cada frame.

export interface Interactable {
  id: string;
  position: [number, number, number];
  radius: number;
  prompt: string;
  action: () => void;
}

const registry = new Map<string, Interactable>();

export function registerInteractable(item: Interactable): () => void {
  registry.set(item.id, item);
  return () => registry.delete(item.id);
}

export function getInteractables(): Interactable[] {
  return Array.from(registry.values());
}
