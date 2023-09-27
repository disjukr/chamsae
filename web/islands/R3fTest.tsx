import { useRef, useState } from "preact/hooks";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import NoSsr from "../misc/NoSsr.ts";

export default function R3fTest() {
  return (
    <NoSsr>
      <Canvas>
        <color args={[0xabcdef]} attach="background" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} intensity={1} />
        <directionalLight position={[-1, -2, -3]} intensity={0.5} />
        <RoundedBox
          position={[-1.2, 0, 0]}
          bevelSegments={1}
          smoothness={1}
          radius={0.1}
        >
          <meshStandardMaterial color={"orange"} />
        </RoundedBox>
        <Box position={[1.2, 0, 0]} />
      </Canvas>
    </NoSsr>
  );
}

function Box(props: any) {
  const ref = useRef<THREE.Mesh>();
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  useFrame((_, delta) => (ref.current!.rotation.x += delta));
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(_) => click(!clicked)}
      onPointerOver={(_) => hover(true)}
      onPointerOut={(_) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}
