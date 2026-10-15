import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { DoubleSide, Vector2, type Mesh } from "three";
import { SceneCanvas, type SceneProps } from "../SceneCanvas";

const BRASS = "#c8a04a";
const WOOD = "#5a3519";

function Record({ animate }: { animate: boolean }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (animate && ref.current) ref.current.rotation.y += delta * 2.6;
  });
  return (
    <mesh ref={ref} position={[0, -0.32, 0]}>
      <cylinderGeometry args={[0.72, 0.72, 0.03, 48]} />
      <meshStandardMaterial color="#141414" roughness={0.35} />
    </mesh>
  );
}

/** A turn-of-the-century disc gramophone with a large flared brass horn. */
export default function Gramophone1900(props: SceneProps) {
  // The horn is a lathe: a flare profile spun around its axis.
  const hornProfile = useMemo(() => Array.from({ length: 24 }, (_, i) => {
    const t = i / 23;
    return new Vector2(0.06 + Math.pow(t, 3.2) * 0.95, t * 1.7);
  }), []);

  return (
    <SceneCanvas {...props} cameraZ={5.4} cameraY={1} rotateSpeed={0.2}>
      <group position={[0, -0.35, 0]} rotation={[0, -0.4, 0]}>
        {/* cabinet */}
        <mesh position={[0, -0.62, 0]}>
          <boxGeometry args={[1.7, 0.55, 1.7]} />
          <meshStandardMaterial color={WOOD} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.33, 0]}>
          <boxGeometry args={[1.8, 0.06, 1.8]} />
          <meshStandardMaterial color="#3e220f" roughness={0.5} />
        </mesh>
        <mesh position={[0.86, -0.62, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.12, 16]} />
          <meshStandardMaterial color={BRASS} metalness={0.8} roughness={0.3} />
        </mesh>
        <Record animate={props.animate} />
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.031, 32]} />
          <meshStandardMaterial color="#8b1e1e" />
        </mesh>
        {/* tone arm rising into the horn */}
        <mesh position={[0.62, 0.05, -0.5]} rotation={[0.35, 0, 0.1]}>
          <cylinderGeometry args={[0.045, 0.06, 0.8, 16]} />
          <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0.45, -0.25, -0.15]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color={BRASS} metalness={0.85} roughness={0.25} />
        </mesh>
        <group position={[0.68, 0.42, -0.62]} rotation={[-0.95, 0.5, 0.55]}>
          <mesh>
            <latheGeometry args={[hornProfile, 48]} />
            <meshStandardMaterial color={BRASS} metalness={0.75} roughness={0.28} side={DoubleSide} />
          </mesh>
        </group>
      </group>
    </SceneCanvas>
  );
}
