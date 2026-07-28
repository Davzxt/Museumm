import { useQualityStore } from '../../store/useQualityStore';

// Iluminação global da cena — adaptativa por qualidade
export function Lighting() {
  const mode = useQualityStore((s) => s.settings.lightCount);
  const reduced = mode === 'reduced';

  return (
    <>
      <ambientLight intensity={0.22} color="#b8ccee" />

      {/* Luz principal do hall — única com sombra */}
      <spotLight
        position={[0, 7.8, 0]}
        angle={0.85}
        penumbra={0.7}
        intensity={140}
        color="#dff2ff"
        distance={30}
        decay={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />

      {/* Preenchimentos suaves ao longo do hall */}
      {!reduced && (
        <>
          <pointLight position={[14, 6, 0]} intensity={26} color="#8be9fd" distance={22} decay={1.8} />
          <pointLight position={[-14, 6, 0]} intensity={26} color="#b388ff" distance={22} decay={1.8} />
        </>
      )}

      {/* Corredor de entrada */}
      <pointLight position={[24, 4, 0]} intensity={18} color="#9fdcff" distance={14} decay={1.8} />

      {/* Sala da conclusão */}
      {!reduced && (
        <pointLight position={[-26, 4.5, 0]} intensity={22} color="#fb7185" distance={16} decay={1.8} />
      )}

      {/* Hemisférica leve para evitar pretos absolutos */}
      <hemisphereLight intensity={0.12} color="#274060" groundColor="#05070d" />
    </>
  );
}
