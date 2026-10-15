import { AdaptiveDpr, Html, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { Group } from "three";
import type { HubRingProps, RingColors } from "../ringTypes";

const RADIUS = 4.6;
const W = 1.5;
const H = 2;

function PortalMesh({ shape, border, glow, colors, selected }: { shape: HubRingProps["frame"]["shape"]; border: number; glow: boolean; colors: RingColors; selected: boolean }) {
  const b = W * border;
  return (
    <group scale={selected ? 1.12 : 1}>
      {glow && (
        <mesh position={[0, 0, -0.04]}>
          <planeGeometry args={[W + 0.35, H + 0.35]} />
          <meshBasicMaterial color={colors.accent} transparent opacity={0.22} />
        </mesh>
      )}
      {shape === "round" ? (
        <>
          <RoundedBox args={[W, H, 0.04]} radius={0.16} smoothness={4}>
            <meshBasicMaterial color={colors.frame} />
          </RoundedBox>
          <RoundedBox args={[W - b * 2, H - b * 2, 0.04]} radius={0.1} smoothness={4} position={[0, 0, 0.02]}>
            <meshBasicMaterial color={colors.inner} />
          </RoundedBox>
        </>
      ) : (
        <>
          <mesh>
            <planeGeometry args={[W, H]} />
            <meshBasicMaterial color={colors.frame} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[W - b * 2, H - b * 2]} />
            <meshBasicMaterial color={colors.inner} />
          </mesh>
          {shape === "arch" && (
            <>
              <mesh position={[0, H / 2, 0]}>
                <circleGeometry args={[W / 2, 32, 0, Math.PI]} />
                <meshBasicMaterial color={colors.frame} />
              </mesh>
              <mesh position={[0, H / 2, 0.01]}>
                <circleGeometry args={[W / 2 - b, 32, 0, Math.PI]} />
                <meshBasicMaterial color={colors.inner} />
              </mesh>
            </>
          )}
        </>
      )}
    </group>
  );
}

/** Labels are DOM overlays, so only portals facing the camera get one (others would float in mid-air). */
const nearFront = (i: number, current: number, n: number) => {
  const d = Math.abs(i - current);
  return Math.min(d, n - d) <= 1;
};

function Ring({ portals, index, frame, colors, reduced, flying, onSelect }: Omit<HubRingProps, "onArrive">) {
  const group = useRef<Group>(null);
  const angle = useRef(0);
  const invalidate = useThree((s) => s.invalidate);
  const step = (Math.PI * 2) / portals.length;
  const flyIndex = flying ? portals.findIndex((p) => p.id === flying) : -1;
  const target = -(flyIndex >= 0 ? flyIndex : index) * step;

  useEffect(() => {
    if (reduced && group.current) {
      angle.current = target;
      group.current.rotation.y = target;
      invalidate();
    }
  }, [reduced, target, invalidate]);

  useFrame(() => {
    if (!group.current || reduced) return;
    // Shortest way round, eased.
    let diff = target - angle.current;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    angle.current += diff * 0.08;
    group.current.rotation.y = angle.current;
  });

  return (
    <group ref={group}>
      {portals.map((p, i) => {
        const a = i * step;
        return (
          <group key={p.id} position={[Math.sin(a) * RADIUS, 0, Math.cos(a) * RADIUS]} rotation={[0, a, 0]} onClick={(e) => { e.stopPropagation(); onSelect(p.id, i); }}>
            <PortalMesh shape={frame.shape} border={frame.border} glow={frame.glow} colors={colors} selected={i === index} />
            {nearFront(i, flyIndex >= 0 ? flyIndex : index, portals.length) && (
              <Html center transform distanceFactor={4.2} position={[0, 0, 0.05]} style={{ pointerEvents: "none" }} zIndexRange={[0, 0]}>
                {p.label}
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

/** Camera flight through the front portal. */
function Rig({ flying, onArrive, reduced }: { flying: string | null; onArrive: (id: string) => void; reduced: boolean }) {
  const camera = useThree((s) => s.camera);
  const done = useRef(false);
  const homeZ = 10.5;
  useEffect(() => {
    done.current = false;
    if (!flying) camera.position.z = homeZ;
  }, [flying, camera]);
  useFrame(() => {
    if (!flying || reduced) return;
    camera.position.z += (RADIUS + 1.1 - camera.position.z) * 0.07;
    if (!done.current && camera.position.z < RADIUS + 1.6) {
      done.current = true;
      onArrive(flying);
    }
  });
  return null;
}

export default function HubRing(props: HubRingProps) {
  return (
    <Canvas
      frameloop={props.reduced ? "demand" : "always"}
      dpr={[1, 2]}
      camera={{ position: [0, 0.6, 10.5], fov: 36 }}
      gl={{ antialias: true, alpha: true }}
      resize={{ offsetSize: true }}
      aria-hidden
    >
      <AdaptiveDpr pixelated />
      <Ring {...props} />
      <Rig flying={props.flying} onArrive={props.onArrive} reduced={props.reduced} />
    </Canvas>
  );
}
