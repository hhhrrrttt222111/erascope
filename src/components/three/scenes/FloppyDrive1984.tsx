import { RoundedBox, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";
import { SceneCanvas, type SceneProps } from "../SceneCanvas";

const BEIGE = "#cfc6a8";
const FONT = `${import.meta.env.BASE_URL}fonts/VT323-Regular.ttf`;

/** The disk slides into the drive slot, waits, and slides out again; the busy light glows while it's in. */
function Disk({ animate, led }: { animate: boolean; led: React.RefObject<Mesh | null> }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = animate ? (clock.elapsedTime % 5) / 5 : 0.5;
    // 0–0.3 slide in, 0.3–0.8 inserted, 0.8–1 slide out.
    const inserted = t < 0.3 ? t / 0.3 : t < 0.8 ? 1 : 1 - (t - 0.8) / 0.2;
    ref.current.position.z = 1.55 - inserted * 0.95;
    const material = led.current?.material as { emissiveIntensity: number } | undefined;
    if (material) material.emissiveIntensity = inserted > 0.98 ? 2 : 0.15;
  });
  return (
    <group ref={ref} position={[0, 0.02, 1.55]}>
      <mesh>
        <boxGeometry args={[1.25, 0.02, 1.25]} />
        <meshStandardMaterial color="#141414" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.012, -0.12]}>
        <boxGeometry args={[0.16, 0.005, 0.5]} />
        <meshStandardMaterial color="#5a5a5a" />
      </mesh>
      <mesh position={[0, 0.012, 0.36]}>
        <boxGeometry args={[0.9, 0.004, 0.32]} />
        <meshStandardMaterial color="#f2efe4" />
      </mesh>
      <Text font={FONT} fontSize={0.16} color="#1a3cff" position={[0, 0.016, 0.36]} rotation={[-Math.PI / 2, 0, 0]} anchorX="center" anchorY="middle">
        DISK 1 · 1984
      </Text>
    </group>
  );
}

/** A 5.25-inch floppy disk sliding into a beige disk drive. */
export default function FloppyDrive1984(props: SceneProps) {
  const led = useRef<Mesh>(null);
  return (
    <SceneCanvas {...props} cameraZ={4.4} cameraY={2} rotateSpeed={0.12}>
      <group position={[0, -0.5, -0.4]}>
        <RoundedBox args={[1.9, 0.62, 1.8]} radius={0.04} smoothness={3}>
          <meshStandardMaterial color={BEIGE} roughness={0.75} />
        </RoundedBox>
        {/* front panel, slot and door latch */}
        <mesh position={[0, 0, 0.905]}>
          <boxGeometry args={[1.86, 0.58, 0.01]} />
          <meshStandardMaterial color="#bdb495" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.02, 0.912]}>
          <boxGeometry args={[1.35, 0.05, 0.01]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0.3, -0.12, 0.92]}>
          <boxGeometry args={[0.3, 0.08, 0.03]} />
          <meshStandardMaterial color="#8a8270" />
        </mesh>
        <mesh ref={led} position={[-0.75, -0.18, 0.915]}>
          <boxGeometry args={[0.08, 0.04, 0.01]} />
          <meshStandardMaterial color="#ff3b30" emissive="#ff3b30" emissiveIntensity={0.15} />
        </mesh>
        <group position={[0, 0.02, 0]}>
          <Disk animate={props.animate} led={led} />
        </group>
      </group>
    </SceneCanvas>
  );
}
