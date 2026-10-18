import { RoundedBox } from "@react-three/drei";
import { SceneCanvas, type SceneProps } from "../SceneCanvas";

/** Smart glasses (camera in the frame, display in the lens) on a charging stand, beside an open earbuds case. No brand. */
export default function SmartGlasses2026(props: SceneProps) {
  const frame = { color: "#1f1b16", roughness: 0.45 } as const;
  return (
    <SceneCanvas {...props} cameraZ={5} cameraY={1.1} rotateSpeed={0.15}>
      <group position={[-0.5, -0.8, 0]}>
        {/* charging stand */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.7, 0.75, 0.08, 40]} />
          <meshStandardMaterial color="#efe8d8" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.3, -0.3]}>
          <boxGeometry args={[0.12, 0.5, 0.12]} />
          <meshStandardMaterial color="#efe8d8" roughness={0.7} />
        </mesh>
        {/* glasses resting on the stand */}
        <group position={[0, 0.58, 0.05]} rotation={[0.05, 0, 0]}>
          {[-0.34, 0.34].map((x) => (
            <group key={x} position={[x, 0, 0]}>
              <mesh>
                <torusGeometry args={[0.24, 0.03, 12, 40]} />
                <meshStandardMaterial {...frame} />
              </mesh>
              <mesh position={[0, 0, -0.005]}>
                <circleGeometry args={[0.235, 40]} />
                <meshStandardMaterial color="#9fb7b0" transparent opacity={0.35} roughness={0.1} metalness={0.3} />
              </mesh>
            </group>
          ))}
          <mesh position={[0, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.22, 10]} />
            <meshStandardMaterial {...frame} />
          </mesh>
          {/* camera and indicator light on the left corner, a display glint on the right lens */}
          <mesh position={[-0.6, 0.12, 0.02]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color="#0b0a09" />
          </mesh>
          <mesh position={[-0.6, 0.2, 0.03]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial color="#c42f34" emissive="#c42f34" emissiveIntensity={1.2} toneMapped={false} />
          </mesh>
          <mesh position={[0.4, 0.06, 0.012]}>
            <planeGeometry args={[0.2, 0.1]} />
            <meshStandardMaterial color="#f7f2e8" emissive="#f7f2e8" emissiveIntensity={0.9} transparent opacity={0.8} toneMapped={false} />
          </mesh>
          {/* temples folded back */}
          {[-0.58, 0.58].map((x) => (
            <mesh key={x} position={[x, 0, -0.45]}>
              <boxGeometry args={[0.04, 0.05, 0.9]} />
              <meshStandardMaterial {...frame} />
            </mesh>
          ))}
        </group>
      </group>

      {/* open earbuds case */}
      <group position={[1.3, -0.8, 0.3]} rotation={[0, -0.5, 0]}>
        <RoundedBox args={[0.8, 0.28, 0.5]} radius={0.12} smoothness={4} position={[0, 0.14, 0]}>
          <meshStandardMaterial color="#efe8d8" roughness={0.6} />
        </RoundedBox>
        <RoundedBox args={[0.8, 0.12, 0.5]} radius={0.06} smoothness={4} position={[0, 0.6, -0.3]} rotation={[-1.2, 0, 0]}>
          <meshStandardMaterial color="#efe8d8" roughness={0.6} />
        </RoundedBox>
        {[-0.18, 0.18].map((x) => (
          <mesh key={x} position={[x, 0.3, 0]}>
            <sphereGeometry args={[0.11, 20, 20]} />
            <meshStandardMaterial color="#f7f2e8" roughness={0.35} />
          </mesh>
        ))}
        <mesh position={[0, 0.2, 0.26]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#3f5b3a" emissive="#3f5b3a" emissiveIntensity={1} toneMapped={false} />
        </mesh>
      </group>
    </SceneCanvas>
  );
}
