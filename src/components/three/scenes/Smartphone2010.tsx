import { Float, RoundedBox } from "@react-three/drei";
import { SceneCanvas, type SceneProps } from "../SceneCanvas";

const APP_COLORS = ["#3b5998", "#42b72a", "#ff9500", "#ff3b30", "#5ac8fa", "#ffcc00", "#af52de", "#34c759", "#007aff", "#ff2d55"];
const COLS = 4;
const ROWS = 5;

/** A glass-fronted smartphone slab that turns slowly, its screen glowing with app icons. */
export default function Smartphone2010(props: SceneProps) {
  const { animate } = props;
  return (
    <SceneCanvas {...props} cameraZ={4.6} cameraY={0.3} rotateSpeed={0.45}>
      <Float speed={animate ? 1.2 : 0} rotationIntensity={animate ? 0.2 : 0} floatIntensity={animate ? 0.4 : 0}>
        <group rotation={[-0.08, 0, 0.06]}>
          <RoundedBox args={[1.15, 2.2, 0.12]} radius={0.06} smoothness={6}>
            <meshStandardMaterial color="#111214" metalness={0.6} roughness={0.25} />
          </RoundedBox>
          {/* steel band */}
          <RoundedBox args={[1.17, 2.22, 0.06]} radius={0.06} smoothness={6}>
            <meshStandardMaterial color="#b9bec6" metalness={0.95} roughness={0.2} />
          </RoundedBox>
          {/* screen */}
          <mesh position={[0, 0.03, 0.062]}>
            <planeGeometry args={[0.98, 1.66]} />
            <meshStandardMaterial color="#0d2240" emissive="#1c4f8f" emissiveIntensity={0.7} />
          </mesh>
          {Array.from({ length: ROWS }, (_, r) =>
            Array.from({ length: COLS }, (_, c) => {
              const color = APP_COLORS[(r * COLS + c) % APP_COLORS.length];
              return (
                <RoundedBox key={`${r}-${c}`} args={[0.17, 0.17, 0.01]} radius={0.04} smoothness={3} position={[-0.33 + c * 0.22, 0.62 - r * 0.27, 0.07]}>
                  <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55} />
                </RoundedBox>
              );
            }),
          )}
          {/* home button and earpiece */}
          <mesh position={[0, -0.97, 0.062]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.005, 32]} />
            <meshStandardMaterial color="#2a2b2e" />
          </mesh>
          <mesh position={[0, 0.96, 0.062]}>
            <boxGeometry args={[0.2, 0.025, 0.005]} />
            <meshStandardMaterial color="#2a2b2e" />
          </mesh>
          {/* back panel so it reads from behind too */}
          <mesh position={[0, 0, -0.062]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[1.05, 2.1]} />
            <meshStandardMaterial color="#1a1b1e" metalness={0.3} roughness={0.15} />
          </mesh>
        </group>
      </Float>
      <pointLight position={[0, 0, 1.5]} intensity={1.2} color="#5aa0ff" distance={4} />
    </SceneCanvas>
  );
}
