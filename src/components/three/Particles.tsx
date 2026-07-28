import { Sparkles } from '@react-three/drei';
import { ROOM_ZONES } from '../../config/museum';
import { useQualityStore } from '../../store/useQualityStore';

// Poeira ambiente cintilante — hall + uma nuvem sutil por sala
export function Particles() {
  const mult = useQualityStore((s) => s.settings.particleMultiplier);

  const hallCount = Math.round(160 * mult);
  const corridorCount = Math.round(40 * mult);
  const roomCount = Math.round(36 * mult);

  if (mult <= 0.3 && roomCount < 5) return null; // Skip particles on very low

  return (
    <group>
      {/* Hall principal */}
      <Sparkles
        count={Math.max(hallCount, 10)}
        scale={[38, 7.5, 19]}
        position={[0, 3.8, 0]}
        size={2.4}
        speed={0.22}
        opacity={0.5}
        color="#8be9fd"
      />
      {/* Corredor */}
      <Sparkles count={Math.max(corridorCount, 6)} scale={[8, 4.5, 7]} position={[24, 2.4, 0]} size={2} speed={0.18} opacity={0.45} color="#9fdcff" />
      {/* Salas: nuvem discreta com a cor de destaque */}
      {ROOM_ZONES.filter((z) => z.id !== 'hall' && z.id !== 'corredor').map((z) => (
        <Sparkles
          key={z.id}
          count={Math.max(roomCount, 5)}
          scale={[z.maxX - z.minX - 1, z.ceiling - 1, z.maxZ - z.minZ - 1]}
          position={[(z.minX + z.maxX) / 2, z.ceiling / 2, (z.minZ + z.maxZ) / 2]}
          size={1.8}
          speed={0.16}
          opacity={0.4}
          color={z.accent}
        />
      ))}
    </group>
  );
}
