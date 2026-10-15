import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { AdditiveBlending, DoubleSide, type Group } from "three";
import { SceneCanvas, type SceneProps } from "../SceneCanvas";

function Reel({ position, animate, speed }: { position: [number, number, number]; animate: boolean; speed: number }) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (animate && ref.current) ref.current.rotation.x += delta * speed;
  });
  return (
    <group ref={ref} position={position}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.46, 0.035, 10, 40]} />
        <meshStandardMaterial color="#b9b9b9" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.32, 0.32, 0.08, 32]} />
        <meshStandardMaterial color="#6b5a3a" roughness={0.6} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[(i * Math.PI) / 3, 0, 0]}>
          <boxGeometry args={[0.06, 0.92, 0.05]} />
          <meshStandardMaterial color="#cfcfcf" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

/** A cinema projector with two spinning reels and a beam of light. */
export default function Projector1930(props: SceneProps) {
  const { animate } = props;
  return (
    <SceneCanvas {...props} cameraZ={5.6} cameraY={0.8} rotateSpeed={0.18}>
      <group position={[0, -0.45, 0]} rotation={[0, -1.3, 0]}>
        <mesh>
          <boxGeometry args={[0.6, 0.8, 1.3]} />
          <meshStandardMaterial color="#5a5248" metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.02, 0.85]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.2, 0.45, 24]} />
          <meshStandardMaterial color="#8a8a8a" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.02, 1.08]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.01, 24]} />
          <meshStandardMaterial color="#fff3c4" emissive="#ffd977" emissiveIntensity={1.4} />
        </mesh>
        {/* light beam */}
        <mesh position={[0, 0.02, 2.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.7, 2.2, 32, 1, true]} />
          <meshBasicMaterial color="#ffe9a8" transparent opacity={0.08} blending={AdditiveBlending} side={DoubleSide} depthWrite={false} />
        </mesh>
        {/* reel arms */}
        <mesh position={[0, 0.75, 0.38]} rotation={[0.5, 0, 0]}>
          <boxGeometry args={[0.06, 0.8, 0.06]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0, 0.75, -0.38]} rotation={[-0.5, 0, 0]}>
          <boxGeometry args={[0.06, 0.8, 0.06]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <Reel position={[0, 1.18, 0.62]} animate={animate} speed={-1.8} />
        <Reel position={[0, 1.18, -0.62]} animate={animate} speed={-1.4} />
        {/* stand */}
        <mesh position={[0, -0.75, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.7, 12]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[0, -1.1, 0]}>
          <cylinderGeometry args={[0.55, 0.6, 0.06, 32]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
    </SceneCanvas>
  );
}
