import { useRef, useState } from "preact/hooks";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import NoSsr from "../misc/NoSsr.ts";

export default function R3fTest() {
  return (
    <NoSsr>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
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
