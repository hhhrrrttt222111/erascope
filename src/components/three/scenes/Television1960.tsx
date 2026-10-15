import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { ShaderMaterial } from "three";
import { SceneCanvas, type SceneProps } from "../SceneCanvas";

const NOISE_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const NOISE_FRAG = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  float rand(vec2 co) { return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453); }
  void main() {
    vec2 cell = floor(vUv * vec2(180.0, 135.0));
    float n = rand(cell + floor(uTime * 24.0));
    float scan = 0.82 + 0.18 * sin(vUv.y * 420.0 + uTime * 6.0);
    float roll = 0.9 + 0.1 * sin((vUv.y + uTime * 0.3) * 6.2831);
    float vignette = smoothstep(0.85, 0.25, length((vUv - 0.5) * vec2(1.1, 1.3)));
    float v = (0.08 + n * 0.85) * scan * roll * vignette;
    gl_FragColor = vec4(vec3(v) * vec3(0.92, 0.98, 1.0), 1.0);
  }
`;

function StaticScreen({ animate }: { animate: boolean }) {
  const material = useMemo(
    () => new ShaderMaterial({ uniforms: { uTime: { value: 1.3 } }, vertexShader: NOISE_VERT, fragmentShader: NOISE_FRAG }),
    [],
  );
  useFrame((_, delta) => {
    if (animate) material.uniforms.uTime.value += delta;
  });
  return (
    <mesh position={[-0.25, 0.08, 0.66]} material={material}>
      <planeGeometry args={[1.35, 1.02]} />
    </mesh>
  );
}

/** A mid-century console TV on splayed legs, showing animated static. */
export default function Television1960(props: SceneProps) {
  return (
    <SceneCanvas {...props} cameraZ={5.3} rotateSpeed={0.2}>
      <group rotation={[0, -0.3, 0]} position={[0, 0.05, 0]}>
        <RoundedBox args={[2.3, 1.6, 1.25]} radius={0.16} smoothness={4}>
          <meshStandardMaterial color="#6a4126" roughness={0.45} />
        </RoundedBox>
        {/* cream bezel around the picture tube */}
        <RoundedBox args={[1.55, 1.2, 0.1]} radius={0.12} smoothness={4} position={[-0.25, 0.08, 0.6]}>
          <meshStandardMaterial color="#efe3c8" roughness={0.6} />
        </RoundedBox>
        <StaticScreen animate={props.animate} />
        {/* control panel with knobs and speaker slots */}
        <mesh position={[0.82, 0.08, 0.63]}>
          <boxGeometry args={[0.45, 1.2, 0.02]} />
          <meshStandardMaterial color="#0f6e6e" roughness={0.5} />
        </mesh>
        {[0.42, 0.12].map((y) => (
          <mesh key={y} position={[0.82, y, 0.68]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.12, 0.08, 28]} />
            <meshStandardMaterial color="#d9822b" roughness={0.35} />
          </mesh>
        ))}
        {[-0.18, -0.26, -0.34, -0.42].map((y) => (
          <mesh key={y} position={[0.82, y, 0.645]}>
            <boxGeometry args={[0.3, 0.025, 0.01]} />
            <meshStandardMaterial color="#073d3d" />
          </mesh>
        ))}
        {/* splayed legs */}
        {[-1, 1].flatMap((sx) =>
          [-1, 1].map((sz) => (
            <mesh key={`${sx}${sz}`} position={[sx * 0.9, -1.05, sz * 0.4]} rotation={[sz * 0.18, 0, -sx * 0.18]}>
              <cylinderGeometry args={[0.035, 0.02, 0.55, 12]} />
              <meshStandardMaterial color="#2b2118" />
            </mesh>
          )),
        )}
        {/* rabbit-ear antenna */}
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.12, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#2b2118" />
        </mesh>
        {[-1, 1].map((s) => (
          <group key={s} position={[0, 0.9, 0]} rotation={[0, 0, s * 0.45]}>
            <mesh position={[0, 0.55, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 1.1, 8]} />
              <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 1.1, 0]}>
              <sphereGeometry args={[0.03, 12, 12]} />
              <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>
    </SceneCanvas>
  );
}
