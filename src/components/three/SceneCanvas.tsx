import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { useRef, type ReactNode } from "react";
import type { Group } from "three";
import type { SceneProps } from "./sceneTypes";

export type { SceneProps };

interface CanvasProps extends SceneProps {
  children: ReactNode;
  cameraZ?: number;
  cameraY?: number;
  shadows?: boolean;
  rotateSpeed?: number;
}

/** Slowly spins its children around Y. Replaces OrbitControls' autoRotate so it also works without controls. */
export function Turntable({ animate, speed = 0.25, children }: { animate: boolean; speed?: number; children: ReactNode }) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (animate && ref.current) ref.current.rotation.y += delta * speed;
  });
  return <group ref={ref}>{children}</group>;
}

/** Shared canvas setup: camera, lights, soft contact shadow and limited orbit controls (zoom off). */
export function SceneCanvas({ children, animate, frameloop, interactive, cameraZ = 5, cameraY = 0.6, shadows = true, rotateSpeed = 0.25 }: CanvasProps) {
  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 1.75]}
      camera={{ position: [0, cameraY, cameraZ], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      // Measure layout size, not the transformed box: scenes often mount mid era-transition (flip, CRT squash).
      resize={{ offsetSize: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <directionalLight position={[-4, 2, -2]} intensity={0.4} />
      <Turntable animate={animate} speed={rotateSpeed}>
        {children}
      </Turntable>
      {shadows && <ContactShadows position={[0, -1.25, 0]} opacity={0.45} scale={7} blur={2.4} far={3} />}
      {interactive && (
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3.2} maxPolarAngle={Math.PI / 1.9} />
      )}
    </Canvas>
  );
}
