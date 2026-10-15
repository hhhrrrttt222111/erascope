import { RoundedBox, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";
import { SceneCanvas, type SceneProps } from "../SceneCanvas";

const BEIGE = "#d9cfb2";
const PIXEL_FONT = `${import.meta.env.BASE_URL}fonts/Silkscreen-Regular.ttf`;

function Cursor({ animate }: { animate: boolean }) {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.visible = !animate || Math.floor(clock.elapsedTime * 2) % 2 === 0;
  });
  return (
    <mesh ref={ref} position={[0.08, -0.32, 0.73]}>
      <planeGeometry args={[0.1, 0.03]} />
      <meshBasicMaterial color="#b7ffb7" />
    </mesh>
  );
}

const KEY_ROWS = 4;
const KEY_COLS = 13;

/** A beige CRT monitor and keyboard. The screen shows the year in a pixel font. */
export default function CrtPc1999(props: SceneProps) {
  return (
    <SceneCanvas {...props} cameraZ={5.6} cameraY={0.9} rotateSpeed={0.18}>
      <group rotation={[0, -0.25, 0]} position={[0, 0.15, -0.2]}>
        {/* monitor shell, deep back and stand */}
        <RoundedBox args={[2, 1.65, 0.5]} radius={0.06} smoothness={4} position={[0, 0.2, 0.45]}>
          <meshStandardMaterial color={BEIGE} roughness={0.7} />
        </RoundedBox>
        <mesh position={[0, 0.22, -0.15]}>
          <boxGeometry args={[1.5, 1.25, 0.8]} />
          <meshStandardMaterial color={BEIGE} roughness={0.75} />
        </mesh>
        <mesh position={[0, -0.72, 0.2]}>
          <cylinderGeometry args={[0.55, 0.65, 0.12, 32]} />
          <meshStandardMaterial color={BEIGE} roughness={0.75} />
        </mesh>
        {/* screen */}
        <mesh position={[0, 0.25, 0.705]}>
          <planeGeometry args={[1.6, 1.2]} />
          <meshStandardMaterial color="#1b1b1b" />
        </mesh>
        <mesh position={[0, 0.25, 0.71]}>
          <planeGeometry args={[1.45, 1.06]} />
          <meshStandardMaterial color="#04324a" emissive="#06415f" emissiveIntensity={0.9} />
        </mesh>
        <Text font={PIXEL_FONT} fontSize={0.3} color="#b7ffb7" position={[0, 0.4, 0.72]} anchorX="center" anchorY="middle">
          1999
        </Text>
        <Text font={PIXEL_FONT} fontSize={0.075} color="#b7ffb7" position={[-0.2, -0.13, 0.72]} anchorX="center" anchorY="middle">
          {"C:\\> DIR Y2K"}
        </Text>
        <Text font={PIXEL_FONT} fontSize={0.075} color="#b7ffb7" position={[-0.45, -0.31, 0.72]} anchorX="center" anchorY="middle">
          {"C:\\>"}
        </Text>
        <Cursor animate={props.animate} />
        {/* power LED */}
        <mesh position={[0.82, -0.47, 0.71]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={1.5} />
        </mesh>
        {/* keyboard */}
        <group position={[0, -1.05, 1.25]} rotation={[0.12, 0, 0]}>
          <RoundedBox args={[2.2, 0.12, 0.75]} radius={0.03} smoothness={3}>
            <meshStandardMaterial color={BEIGE} roughness={0.75} />
          </RoundedBox>
          {Array.from({ length: KEY_ROWS }, (_, r) =>
            Array.from({ length: KEY_COLS }, (_, c) => (
              <mesh key={`${r}-${c}`} position={[-0.96 + c * 0.16, 0.08, -0.24 + r * 0.155]}>
                <boxGeometry args={[0.13, 0.05, 0.13]} />
                <meshStandardMaterial color={r === KEY_ROWS - 1 && c > 3 && c < 9 ? "#bfb497" : "#e8dfc6"} roughness={0.8} />
              </mesh>
            )),
          )}
        </group>
      </group>
    </SceneCanvas>
  );
}
