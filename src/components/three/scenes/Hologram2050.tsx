import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry, DoubleSide, type Group } from "three";
import { SceneCanvas, type SceneProps } from "../SceneCanvas";

const CYAN = "#22e4ff";
const MAGENTA = "#ff4fd8";

/** Small seeded PRNG (mulberry32) so the particle cloud is the same on every render. */
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function useParticles(count: number) {
  return useMemo(() => {
    const random = seeded(2050);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.1 + random() * 0.9;
      const theta = random() * Math.PI * 2;
      const y = (random() - 0.3) * 2.4;
      positions.set([Math.cos(theta) * r, y, Math.sin(theta) * r], i * 3);
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    return geometry;
  }, [count]);
}

/** Two orbit rings spinning on different axes. Lives inside the Canvas so it can use useFrame. */
function Rings({ animate }: { animate: boolean }) {
  const rings = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!animate || !rings.current) return;
    rings.current.children[0].rotation.z += delta * 0.4;
    rings.current.children[1].rotation.x += delta * 0.3;
  });
  return (
    <group ref={rings}>
      <mesh rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[1.3, 0.012, 8, 96]} />
        <meshBasicMaterial color={MAGENTA} transparent opacity={0.85} blending={AdditiveBlending} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 3]}>
        <torusGeometry args={[1.45, 0.008, 8, 96]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.7} blending={AdditiveBlending} />
      </mesh>
    </group>
  );
}

/** SPECULATIVE: a holographic projector showing a wireframe globe in additive light. */
export default function Hologram2050(props: SceneProps) {
  const { animate } = props;
  const particles = useParticles(260);

  return (
    <SceneCanvas {...props} shadows={false} cameraZ={5.4} cameraY={0.8} rotateSpeed={0.3}>
      {/* projector base */}
      <group position={[0, -1.15, 0]}>
        <mesh>
          <cylinderGeometry args={[0.85, 1, 0.18, 48]} />
          <meshStandardMaterial color="#141833" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.025, 12, 64]} />
          <meshBasicMaterial color={CYAN} toneMapped={false} />
        </mesh>
        {/* light cone */}
        <mesh position={[0, 1.1, 0]}>
          <coneGeometry args={[1.25, 2.1, 48, 1, true]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.07} blending={AdditiveBlending} side={DoubleSide} depthWrite={false} />
        </mesh>
      </group>

      <Float speed={animate ? 1.4 : 0} rotationIntensity={0} floatIntensity={animate ? 0.4 : 0}>
        <group position={[0, 0.35, 0]}>
          <mesh>
            <icosahedronGeometry args={[0.95, 3]} />
            <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.55} blending={AdditiveBlending} depthWrite={false} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.9, 32, 32]} />
            <meshBasicMaterial color={CYAN} transparent opacity={0.08} blending={AdditiveBlending} depthWrite={false} />
          </mesh>
          <Rings animate={animate} />
        </group>
      </Float>

      <points geometry={particles}>
        <pointsMaterial color={MAGENTA} size={0.03} transparent opacity={0.8} blending={AdditiveBlending} depthWrite={false} />
      </points>
    </SceneCanvas>
  );
}
