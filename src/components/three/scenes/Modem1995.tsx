import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh, MeshStandardMaterial } from "three";
import { SceneCanvas, type SceneProps } from "../SceneCanvas";

const LED_COUNT = 8;

/** A row of status lights that chase like a modem negotiating a connection. */
function Leds({ animate }: { animate: boolean }) {
  const refs = useRef<(Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const step = Math.floor(clock.elapsedTime * 6);
    refs.current.forEach((m, i) => {
      if (!m) return;
      const lit = !animate ? i % 2 === 0 : (step + i * 3) % 7 < 3 || i === 0;
      (m.material as MeshStandardMaterial).emissiveIntensity = lit ? 2.2 : 0.1;
    });
  });
  return (
    <>
      {Array.from({ length: LED_COUNT }, (_, i) => (
        <mesh key={i} ref={(m) => (refs.current[i] = m)} position={[-0.7 + i * 0.2, 0.02, 0.86]}>
          <boxGeometry args={[0.08, 0.04, 0.02]} />
          <meshStandardMaterial color={i === 0 ? "#39ff14" : "#ff3b30"} emissive={i === 0 ? "#39ff14" : "#ff3b30"} emissiveIntensity={0.1} />
        </mesh>
      ))}
    </>
  );
}

/** An external dial-up modem with blinking status lights and a phone cord. */
export default function Modem1995(props: SceneProps) {
  return (
    <SceneCanvas {...props} cameraZ={4.2} cameraY={1.6} rotateSpeed={0.2}>
      <group position={[0, -0.45, 0]} rotation={[0, -0.3, 0]}>
        <RoundedBox args={[2, 0.36, 1.7]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color="#3a3a3f" roughness={0.5} />
        </RoundedBox>
        {/* sloped front panel */}
        <mesh position={[0, 0.02, 0.84]} rotation={[-0.25, 0, 0]}>
          <boxGeometry args={[1.9, 0.18, 0.03]} />
          <meshStandardMaterial color="#1f1f23" roughness={0.4} />
        </mesh>
        <Leds animate={props.animate} />
        {/* vents */}
        {[-0.5, -0.3, -0.1, 0.1, 0.3, 0.5].map((x) => (
          <mesh key={x} position={[x, 0.185, -0.3]}>
            <boxGeometry args={[0.1, 0.005, 0.7]} />
            <meshStandardMaterial color="#26262b" />
          </mesh>
        ))}
        {/* phone cord */}
        <mesh position={[0.95, -0.02, -0.95]} rotation={[Math.PI / 2, 0, 0.3]}>
          <torusGeometry args={[0.35, 0.025, 8, 32, Math.PI]} />
          <meshStandardMaterial color="#e6e1d0" />
        </mesh>
      </group>
    </SceneCanvas>
  );
}
