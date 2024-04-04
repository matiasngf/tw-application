import { forwardRef } from "react";
import { Cat } from "./cat";
import { Group } from "three";
import { GroupProps, useThree } from "@react-three/fiber";

export const Cats = forwardRef<Group, GroupProps>((props, ref) => {
  const isDesktop = useThree((s) => s.gl.domElement.clientWidth > 1000);

  if (!isDesktop) return null;

  return (
    <group scale={0.2} position={[100, 0, 0]} {...props} ref={ref}>
      <group position={[0.7, 0, 0]}>
        <Cat position={[0, 0, -0.2]} />
        <Cat
          position={[-0.5, 0, -0.5]}
          modelPath="/cat3.glb"
          state="idle"
          rotation={[0, Math.PI * 0.7, 0]}
        />
        <Cat
          position={[0, 0, -0.8]}
          modelPath="/cat1.glb"
          state="sleeping"
          rotation={[0, Math.PI * 0.3, 0]}
        />
        <group position={[0, 0, -1]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[2, 2]} />
            <meshBasicMaterial color="white" />
          </mesh>
          <mesh position={[0, -0.5, 1]}>
            <planeGeometry args={[2, 1]} />
            <meshBasicMaterial color="white" />
          </mesh>
        </group>
      </group>
    </group>
  );
});
