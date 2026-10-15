import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef, type ReactNode } from "react";
import type { Group } from "three";

const GOLD = "#c9b48a";

/** A vinyl record: black disc, grooves and a coloured label. Spins on its axis. */
function Vinyl() {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.5;
  });
  return (
    <group rotation={[1.1, 0, 0.3]}>
      <group ref={ref}>
        <mesh>
          <cylinderGeometry args={[1, 1, 0.04, 64]} />
          <meshStandardMaterial color="#17151b" roughness={0.35} metalness={0.4} />
        </mesh>
        {[0.45, 0.6, 0.75, 0.9].map((r) => (
          <mesh key={r} position={[0, 0.021, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, 0.004, 6, 64]} />
            <meshBasicMaterial color="#3a3640" />
          </mesh>
        ))}
        <mesh position={[0, 0.025, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.02, 40]} />
          <meshStandardMaterial color="#d9738a" />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} />
          <meshBasicMaterial color="#100f14" />
        </mesh>
      </group>
    </group>
  );
}

/** A CRT television with a flickering screen and rabbit-ear antenna. */
function CrtTv() {
  const screen = useRef<{ emissiveIntensity: number } | null>(null);
  useFrame((s) => {
    if (screen.current) screen.current.emissiveIntensity = 0.7 + Math.sin(s.clock.elapsedTime * 18) * 0.12 + Math.sin(s.clock.elapsedTime * 3) * 0.15;
  });
  return (
    <group rotation={[0.1, 0.5, 0]} scale={0.85}>
      <mesh>
        <boxGeometry args={[1.8, 1.4, 1.1]} />
        <meshStandardMaterial color="#8a5a35" roughness={0.7} />
      </mesh>
      <mesh position={[-0.2, 0, 0.56]}>
        <boxGeometry args={[1.15, 0.95, 0.04]} />
        <meshStandardMaterial ref={screen as never} color="#6fd0c0" emissive="#6fd0c0" emissiveIntensity={0.8} />
      </mesh>
      {[0.5, 0.2].map((y) => (
        <mesh key={y} position={[0.68, y - 0.1, 0.56]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.06, 16]} />
          <meshStandardMaterial color="#d8c9a3" />
        </mesh>
      ))}
      {[-0.4, 0.4].map((a) => (
        <mesh key={a} position={[a * 0.9, 1.1, 0]} rotation={[0, 0, -a]}>
          <cylinderGeometry args={[0.012, 0.012, 1, 6]} />
          <meshStandardMaterial color="#d8d8d8" metalness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/** A pocket watch whose hands race: the one object about time itself. */
function Watch() {
  const hour = useRef<Group>(null);
  const minute = useRef<Group>(null);
  useFrame((_, dt) => {
    if (minute.current) minute.current.rotation.z -= dt * 3.2;
    if (hour.current) hour.current.rotation.z -= dt * 0.27;
  });
  return (
    <group rotation={[0.4, -0.3, 0]} scale={1.1}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.14, 48]} />
        <meshStandardMaterial color="#d6b25a" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, 0.075]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.01, 48]} />
        <meshStandardMaterial color="#f4ecd6" />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <torusGeometry args={[0.14, 0.03, 8, 20]} />
        <meshStandardMaterial color="#d6b25a" metalness={0.9} roughness={0.25} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} position={[Math.sin((i * Math.PI) / 6) * 0.58, Math.cos((i * Math.PI) / 6) * 0.58, 0.09]}>
          <boxGeometry args={[0.03, i % 3 ? 0.06 : 0.12, 0.01]} />
          <meshBasicMaterial color="#2a2619" />
        </mesh>
      ))}
      <group ref={hour} position={[0, 0, 0.1]}>
        <mesh position={[0, 0.17, 0]}><boxGeometry args={[0.05, 0.34, 0.01]} /><meshBasicMaterial color="#17151b" /></mesh>
      </group>
      <group ref={minute} position={[0, 0, 0.11]}>
        <mesh position={[0, 0.26, 0]}><boxGeometry args={[0.03, 0.52, 0.01]} /><meshBasicMaterial color="#b3202e" /></mesh>
      </group>
    </group>
  );
}

/** Rings that rush toward the camera: a tunnel of years. */
function Tunnel() {
  const rings = useRef<(Group | null)[]>([]);
  const N = 9;
  useFrame((_, dt) => {
    rings.current.forEach((r) => {
      if (!r) return;
      r.position.z += dt * 0.5;
      r.rotation.z += dt * 0.1;
      if (r.position.z > 6) r.position.z -= N * 3;
    });
  });
  return (
    <>
      {Array.from({ length: N }, (_, i) => (
        <group key={i} ref={(el) => { rings.current[i] = el; }} position={[0, 0, -i * 3 + 4]}>
          <mesh>
            <torusGeometry args={[7 + (i % 3) * 0.6, 0.015, 8, 96]} />
            <meshBasicMaterial color={GOLD} transparent opacity={0.18} />
          </mesh>
          {/* tick marks like a dial */}
          {Array.from({ length: 24 }, (_, k) => (
            <mesh key={k} position={[Math.cos((k * Math.PI) / 12) * 7.4, Math.sin((k * Math.PI) / 12) * 7.4, 0]} rotation={[0, 0, (k * Math.PI) / 12]}>
              <boxGeometry args={[0.35, 0.02, 0.02]} />
              <meshBasicMaterial color={GOLD} transparent opacity={0.12} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

type Slot = { pos: [number, number, number]; scale: number; node: ReactNode; speed: number };
const SLOTS: Slot[] = [
  { pos: [5.2, 1.4, -2], scale: 0.9, node: <Watch />, speed: 0.6 },
  { pos: [-5.6, 1.8, -4], scale: 0.8, node: <Vinyl />, speed: 0.5 },
  { pos: [5.8, -2.6, -4], scale: 0.75, node: <CrtTv />, speed: 0.5 },
];

function Objects() {
  const group = useRef<Group>(null);
  useFrame((s) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += (s.pointer.x * 0.25 - g.rotation.y) * 0.05;
    g.rotation.x += (-s.pointer.y * 0.15 - g.rotation.x) * 0.05;
  });
  return (
    <group ref={group}>
      {SLOTS.map((o, i) => (
        <Float key={i} speed={o.speed} rotationIntensity={0.25} floatIntensity={0.6}>
          <group position={o.pos} scale={o.scale}>{o.node}</group>
        </Float>
      ))}
    </group>
  );
}

/** Full-bleed 3D backdrop: era artefacts drifting through a tunnel of years. */
export default function TimeScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 8], fov: 55 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} color="#fff1d0" />
      <pointLight position={[-6, -2, 3]} intensity={25} color="#6fb7d6" />
      <Tunnel />
      <Objects />
    </Canvas>
  );
}
