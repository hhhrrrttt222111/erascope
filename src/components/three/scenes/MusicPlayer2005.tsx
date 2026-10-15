import { Float, RoundedBox } from "@react-three/drei";
import { SceneCanvas, type SceneProps } from "../SceneCanvas";

/** A white click-wheel MP3 player with a glowing screen. */
export default function MusicPlayer2005(props: SceneProps) {
  const { animate } = props;
  return (
    <SceneCanvas {...props} cameraZ={4.2} cameraY={0.2} rotateSpeed={0.4}>
      <Float speed={animate ? 1.3 : 0} rotationIntensity={animate ? 0.25 : 0} floatIntensity={animate ? 0.4 : 0}>
        <group rotation={[-0.1, 0, 0.05]}>
          <RoundedBox args={[1.2, 2.0, 0.22]} radius={0.12} smoothness={6}>
            <meshStandardMaterial color="#f7f7f5" roughness={0.18} metalness={0.05} />
          </RoundedBox>
          {/* polished steel back */}
          <RoundedBox args={[1.18, 1.98, 0.1]} radius={0.12} smoothness={6} position={[0, 0, -0.07]}>
            <meshStandardMaterial color="#d9dde2" metalness={1} roughness={0.15} />
          </RoundedBox>
          {/* screen */}
          <mesh position={[0, 0.48, 0.111]}>
            <planeGeometry args={[0.92, 0.66]} />
            <meshStandardMaterial color="#5aa7e0" emissive="#3f8fd0" emissiveIntensity={0.6} />
          </mesh>
          {[0.68, 0.56, 0.44, 0.32].map((y, i) => (
            <mesh key={y} position={[-0.05, y, 0.112]}>
              <planeGeometry args={[i === 0 ? 0.7 : 0.6, 0.06]} />
              <meshBasicMaterial color={i === 1 ? "#0b3d6e" : "#e8f4ff"} />
            </mesh>
          ))}
          {/* click wheel and centre button */}
          <mesh position={[0, -0.42, 0.112]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.005, 48]} />
            <meshStandardMaterial color="#e4e4e2" roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.42, 0.116]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.006, 32]} />
            <meshStandardMaterial color="#f7f7f5" roughness={0.2} />
          </mesh>
          {/* earphone cable */}
          <mesh position={[0.32, 1.2, 0]} rotation={[0, 0, 0.6]}>
            <torusGeometry args={[0.32, 0.015, 8, 32, Math.PI * 1.2]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      </Float>
    </SceneCanvas>
  );
}
