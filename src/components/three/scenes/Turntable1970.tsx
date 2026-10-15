import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { SceneCanvas, type SceneProps } from "../SceneCanvas";

function Platter({ animate }: { animate: boolean }) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    // 33⅓ rpm is about 3.5 radians a second.
    if (animate && ref.current) ref.current.rotation.y -= delta * 3.5;
  });
  return (
    <group ref={ref} position={[-0.25, 0.15, 0]}>
      <mesh>
        <cylinderGeometry args={[0.85, 0.85, 0.05, 64]} />
        <meshStandardMaterial color="#111" roughness={0.3} />
      </mesh>
      {[0.4, 0.55, 0.7].map((r) => (
        <mesh key={r} position={[0, 0.027, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.004, 4, 64]} />
          <meshStandardMaterial color="#2c2c2c" />
        </mesh>
      ))}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.01, 32]} />
        <meshStandardMaterial color="#c75b12" />
      </mesh>
      <mesh position={[0.12, 0.031, 0]}>
        <boxGeometry args={[0.1, 0.005, 0.06]} />
        <meshStandardMaterial color="#f6e3b4" />
      </mesh>
    </group>
  );
}

/** A wood-plinth turntable playing an LP. */
export default function Turntable1970(props: SceneProps) {
  return (
    <SceneCanvas {...props} cameraZ={4.6} cameraY={2.2} rotateSpeed={0.15}>
      <group position={[0, -0.6, 0]}>
        <mesh>
          <boxGeometry args={[2.5, 0.22, 1.9]} />
          <meshStandardMaterial color="#7a4723" roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.115, 0]}>
          <boxGeometry args={[2.42, 0.01, 1.82]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.4} roughness={0.5} />
        </mesh>
        <Platter animate={props.animate} />
        {/* tonearm */}
        <mesh position={[0.95, 0.2, -0.55]}>
          <cylinderGeometry args={[0.09, 0.11, 0.18, 24]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.62, 0.26, -0.18]} rotation={[0, 0.85, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 1.0, 12]} />
          <meshStandardMaterial color="#d0d0d0" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.28, 0.2, 0.18]}>
          <boxGeometry args={[0.12, 0.05, 0.08]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        {/* speed knob */}
        <mesh position={[0.95, 0.16, 0.6]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 24]} />
          <meshStandardMaterial color="#e9b44c" />
        </mesh>
      </group>
    </SceneCanvas>
  );
}
