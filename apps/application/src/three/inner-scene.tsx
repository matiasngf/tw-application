"use client";

import { Color, PerspectiveCamera as ThreeCamera, SpotLight } from "three";
import { useRef, useState } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Branch, BranchUniformParmas } from "./components/plants/branch";
import { useUniforms } from "./hooks/use-uniforms";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const InnerScene = () => {
  const aspect = useThree((s) => s.viewport.aspect);

  const lightRef = useRef<SpotLight | null>(null);
  const [cameraRef, setCameraRef] = useState<ThreeCamera | null>(null);

  useFrame(({ camera, scene }) => {
    scene.background = new Color("white");
    lightRef.current?.target.position.set(0, 0, 0);
  });

  const [bUnifoms] = useUniforms({
    branchGrowOffset: 0,
    branchRadius: 0.003,
    progress: 0,
  } satisfies BranchUniformParmas);

  useGSAP(() => {
    gsap.to(bUnifoms.progress, {
      value: 1.5,
      delay: 1.5,
      duration: 10,
      ease: `power1.out`,
    });
  });

  useGSAP(
    () => {
      if (!cameraRef) return;
      const p = {
        progress: 0,
      };
      gsap.to(p, {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        progress: 1,
        onUpdate: () => {
          const bodyHeight = document.body.clientHeight;
          cameraRef.position.y = -p.progress * (bodyHeight / 500);
        },
      });
    },
    {
      dependencies: [cameraRef],
    }
  );

  return (
    <>
      <PerspectiveCamera
        ref={(r) => {
          if (r) {
            setCameraRef(r);
          }
        }}
        makeDefault
        fov={40}
        position={[0, 0, 4]}
      />

      <Branch
        scale={0.8 * aspect}
        rotation={[0, 0, Math.PI * -0.1]}
        position={[-aspect * 1.7, 1, 0]}
        variant={0}
        uniforms={bUnifoms}
        branchlets={17}
      />

      <Branch
        scale={0.8 * aspect}
        rotation={[0, Math.PI, 0]}
        position={[aspect * 1.5, -0.7, 0]}
        variant={2}
        uniforms={bUnifoms}
        branchlets={10}
      />

      <spotLight
        ref={lightRef}
        position={[0, 5, 5]}
        intensity={100}
        castShadow
        angle={0.2}
        penumbra={0.3}
      />
      <ambientLight intensity={0} />

      {/* <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshPhysicalMaterial color="white" />
      </mesh> */}
    </>
  );
};
