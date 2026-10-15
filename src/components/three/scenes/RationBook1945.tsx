import { Float, RoundedBox } from "@react-three/drei";
import { SceneCanvas, type SceneProps } from "../SceneCanvas";

const TIN_LABELS = ["#a33a2c", "#1f3a5f", "#5b5a2f", "#c9a24a"];

/** A wartime ration book lying open beside a stack of food tins. */
export default function RationBook1945(props: SceneProps) {
  const { animate } = props;
  return (
    <SceneCanvas {...props} cameraZ={5} cameraY={1.6} rotateSpeed={0.15}>
      <group position={[0, -0.7, 0]}>
        {/* ration book: cover, pages and a sheet of stamps */}
        <Float speed={animate ? 1.2 : 0} rotationIntensity={0} floatIntensity={animate ? 0.15 : 0}>
          <group position={[-0.55, 0, 0.2]} rotation={[0, 0.35, 0]}>
            <mesh>
              <boxGeometry args={[1.5, 0.05, 1.05]} />
              <meshStandardMaterial color="#c9b98d" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.035, 0]}>
              <boxGeometry args={[1.42, 0.02, 0.98]} />
              <meshStandardMaterial color="#efe6cc" roughness={0.95} />
            </mesh>
            {Array.from({ length: 4 }, (_, r) =>
              Array.from({ length: 6 }, (_, c) => (
                <mesh key={`${r}-${c}`} position={[-0.56 + c * 0.22, 0.05, -0.33 + r * 0.22]}>
                  <boxGeometry args={[0.19, 0.005, 0.19]} />
                  <meshStandardMaterial color={r < 2 ? "#e2c9c3" : "#c9d3e2"} roughness={0.9} />
                </mesh>
              )),
            )}
            <mesh position={[0, 0.002, 0]} rotation={[0, 0, 0]}>
              <boxGeometry args={[0.02, 0.06, 1.05]} />
              <meshStandardMaterial color="#8a7b55" />
            </mesh>
          </group>
        </Float>
        {/* a stack of tins */}
        {[0, 1, 2].map((i) => (
          <group key={i} position={[0.85, 0.22 + i * 0.44, -0.25]}>
            <mesh>
              <cylinderGeometry args={[0.3, 0.3, 0.42, 32]} />
              <meshStandardMaterial color="#b9b9b9" metalness={0.85} roughness={0.3} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[0.305, 0.305, 0.26, 32]} />
              <meshStandardMaterial color={TIN_LABELS[i]} roughness={0.7} />
            </mesh>
          </group>
        ))}
        <mesh position={[1.45, 0.17, 0.35]}>
          <cylinderGeometry args={[0.24, 0.24, 0.32, 32]} />
          <meshStandardMaterial color={TIN_LABELS[3]} roughness={0.7} />
        </mesh>
        {/* a pencil for tallying points */}
        <RoundedBox args={[0.9, 0.05, 0.05]} radius={0.02} position={[-0.2, 0.06, 0.95]} rotation={[0, -0.4, 0]}>
          <meshStandardMaterial color="#e3b23c" />
        </RoundedBox>
      </group>
    </SceneCanvas>
  );
}
