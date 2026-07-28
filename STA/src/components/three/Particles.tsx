import { Sparkles } from '@react-three/drei';
import { ROOM_ZONES } from '../../config/museum';

// Poeira ambiente cintilante — hall + uma nuvem sutil por sala
export function Particles() {
  return (
    <group>
      {/* Hall principal */}
      <Sparkles
        count={160}
        scale={[38, 7.5, 19]}
        position={[0, 3.8, 0]}
        size={2.4}
        speed={0.22}
        opacity={0.5}
        color="#8be9fd"
      />
      {/* Corredor */}
      <Sparkles count={40} scale={[8, 4.5, 7]} position={[24, 2.4, 0]} size={2} speed={0.18} opacity={0.45} color="#9fdcff" />
      {/* Salas: nuvem discreta com a cor de destaque */}
      {ROOM_ZONES.filter((z) => z.id !== 'hall' && z.id !== 'corredor').map((z) => (
        <Sparkles
          key={z.id}
          count={36}
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
