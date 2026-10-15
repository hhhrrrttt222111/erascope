import { RoundedBox } from "@react-three/drei";
import { SceneCanvas, type SceneProps } from "../SceneCanvas";

const TILES = ["#8b7cf6", "#3ddc97", "#f5b942", "#5ab0ff"];

/** A laptop on a video call, lit by a ring light. */
export default function Laptop2020(props: SceneProps) {
  return (
    <SceneCanvas {...props} cameraZ={5} cameraY={1.1} rotateSpeed={0.15}>
      <group position={[0, -0.75, 0.2]}>
        {/* base and keyboard deck */}
        <RoundedBox args={[2.2, 0.08, 1.5]} radius={0.03} smoothness={3}>
          <meshStandardMaterial color="#9ea3aa" metalness={0.8} roughness={0.3} />
        </RoundedBox>
        <mesh position={[0, 0.045, -0.15]}>
          <boxGeometry args={[1.8, 0.01, 0.75]} />
          <meshStandardMaterial color="#2a2c30" />
        </mesh>
        <mesh position={[0, 0.045, 0.45]}>
          <boxGeometry args={[0.7, 0.005, 0.38]} />
          <meshStandardMaterial color="#8d9299" metalness={0.7} roughness={0.35} />
        </mesh>
        {/* lid with a video-call grid on screen */}
        <group position={[0, 0.04, -0.74]} rotation={[-0.25, 0, 0]}>
          <RoundedBox args={[2.2, 1.45, 0.06]} radius={0.03} smoothness={3} position={[0, 0.72, 0]}>
            <meshStandardMaterial color="#9ea3aa" metalness={0.8} roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 0.74, 0.032]}>
            <planeGeometry args={[2.04, 1.28]} />
            <meshStandardMaterial color="#18181b" emissive="#18181b" />
          </mesh>
          {TILES.map((c, i) => (
            <mesh key={c} position={[-0.5 + (i % 2) * 1.0, 1.05 - Math.floor(i / 2) * 0.58, 0.034]}>
              <planeGeometry args={[0.94, 0.52]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.55} />
            </mesh>
          ))}
        </group>
        {/* ring light on a stand */}
        <group position={[1.6, 0, -1.2]}>
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 1.6, 8]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <mesh position={[0, 1.75, 0]} rotation={[0, -0.6, 0]}>
            <torusGeometry args={[0.38, 0.06, 16, 48]} />
            <meshStandardMaterial color="#fff6dc" emissive="#fff1c9" emissiveIntensity={1.6} toneMapped={false} />
          </mesh>
          <pointLight position={[-0.4, 1.7, 0.6]} intensity={2} distance={4} color="#fff1c9" />
        </group>
      </group>
    </SceneCanvas>
  );
}
