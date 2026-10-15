import { PresentationControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import type { DeviceModelProps } from "../ringTypes";

/** A device built from primitives (no imported models), turnable by dragging. */
function Device({ kind, color, accent, animate }: DeviceModelProps) {
  const g = useRef<Group>(null);
  useFrame((_, d) => {
    if (animate && g.current) g.current.rotation.y += d * 0.3;
  });
  return (
    <group ref={g}>
      {kind === "tower" && (
        <>
          <mesh>
            <boxGeometry args={[0.9, 2.2, 1.6]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[0, 0.5, 0.82]}>
            <boxGeometry args={[0.6, 0.15, 0.02]} />
            <meshStandardMaterial color={accent} />
          </mesh>
        </>
      )}
      {kind === "handset" && (
        <>
          <mesh rotation={[0, 0, 0.1]}>
            <boxGeometry args={[0.7, 2.2, 0.3]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[0, 0.6, 0.17]}>
            <planeGeometry args={[0.5, 0.7]} />
            <meshStandardMaterial color={accent} />
          </mesh>
        </>
      )}
      {kind === "slab" && (
        <mesh>
          <boxGeometry args={[2.2, 1.4, 0.12]} />
          <meshStandardMaterial color={color} />
        </mesh>
      )}
      {kind === "box" && (
        <>
          <mesh>
            <boxGeometry args={[1.6, 1.2, 1.2]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[0, 0.1, 0.62]}>
            <circleGeometry args={[0.32, 24]} />
            <meshStandardMaterial color={accent} />
          </mesh>
        </>
      )}
    </group>
  );
}

export default function DeviceModel(props: DeviceModelProps) {
  return (
    <Canvas frameloop={props.animate ? "always" : "demand"} camera={{ position: [0, 0.5, 4.5], fov: 40 }} dpr={[1, 2]} aria-hidden>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 3]} intensity={1.3} />
      <PresentationControls global snap polar={[-0.3, 0.3]} azimuth={[-1, 1]}>
        <Device {...props} />
      </PresentationControls>
    </Canvas>
  );
}
