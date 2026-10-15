import { Float, RoundedBox } from "@react-three/drei";
import { SceneCanvas, type SceneProps } from "../SceneCanvas";

const WOOD = "#6b3f1f";
const DARK_WOOD = "#4a2a14";
const BRASS = "#c9a25a";

/** A wooden tabletop radio built from boxes and cylinders. */
export default function Radio1920(props: SceneProps) {
  const { animate } = props;
  return (
    <SceneCanvas {...props} rotateSpeed={0.2}>
      <Float speed={animate ? 1.5 : 0} rotationIntensity={animate ? 0.15 : 0} floatIntensity={animate ? 0.5 : 0}>
        <group rotation={[0, -0.35, 0]} position={[0, -0.1, 0]}>
          {/* cabinet and top moulding */}
          <RoundedBox args={[2.3, 1.45, 1]} radius={0.08} smoothness={4}>
            <meshStandardMaterial color={WOOD} roughness={0.55} />
          </RoundedBox>
          <mesh position={[0, 0.77, 0]}>
            <boxGeometry args={[2.45, 0.1, 1.1]} />
            <meshStandardMaterial color={DARK_WOOD} roughness={0.5} />
          </mesh>
          {/* inset front panel */}
          <mesh position={[0, 0, 0.51]}>
            <boxGeometry args={[2.0, 1.15, 0.04]} />
            <meshStandardMaterial color={DARK_WOOD} roughness={0.6} />
          </mesh>
          {/* speaker cloth, brass ring and wooden bars */}
          <mesh position={[-0.5, 0.05, 0.54]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.02, 40]} />
            <meshStandardMaterial color="#cdb68a" roughness={0.95} />
          </mesh>
          <mesh position={[-0.5, 0.05, 0.55]}>
            <torusGeometry args={[0.43, 0.03, 12, 48]} />
            <meshStandardMaterial color={BRASS} metalness={0.8} roughness={0.3} />
          </mesh>
          {[-0.2, 0, 0.2].map((x) => (
            <mesh key={x} position={[-0.5 + x, 0.05, 0.57]}>
              <boxGeometry args={[0.05, 0.8, 0.03]} />
              <meshStandardMaterial color={WOOD} />
            </mesh>
          ))}
          {/* glowing tuning window */}
          <mesh position={[0.48, 0.22, 0.54]}>
            <boxGeometry args={[0.7, 0.28, 0.02]} />
            <meshStandardMaterial color="#f5deb0" emissive="#ffb347" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0.4, 0.22, 0.56]}>
            <boxGeometry args={[0.02, 0.24, 0.01]} />
            <meshStandardMaterial color="#8b1e1e" />
          </mesh>
          {/* dials */}
          {[0.26, 0.7].map((x) => (
            <group key={x} position={[x, -0.25, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
              <mesh>
                <cylinderGeometry args={[0.13, 0.15, 0.12, 32]} />
                <meshStandardMaterial color="#2a1a0e" roughness={0.4} />
              </mesh>
              <mesh position={[0, -0.065, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
                <meshStandardMaterial color={BRASS} metalness={0.8} roughness={0.3} />
              </mesh>
            </group>
          ))}
          {/* feet */}
          {[-1, 1].flatMap((sx) =>
            [-1, 1].map((sz) => (
              <mesh key={`${sx}${sz}`} position={[sx * 1.0, -0.8, sz * 0.38]}>
                <boxGeometry args={[0.18, 0.14, 0.18]} />
                <meshStandardMaterial color={DARK_WOOD} />
              </mesh>
            )),
          )}
        </group>
      </Float>
    </SceneCanvas>
  );
}
