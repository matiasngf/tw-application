"use client";

import { Color, PerspectiveCamera as ThreeCamera, SpotLight } from "three";
import { useRef, useState } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Branch, BranchUniformParmas } from "./components/plants/branch";
import { useUniforms } from "./hooks/use-uniforms";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Cat } from "./components/cat";
import { create } from "zustand";

export interface InnerSceneStore {
  cameraRef: {
    current: ThreeCamera | null;
  };
}

export const useInnerScene = create<InnerSceneStore>(() => ({
  cameraRef: {
    current: null,
  },
}));

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
          end: "bottom bottom",
          scrub: true,
        },
        ease: "none",
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
            useInnerScene.getState().cameraRef.current = r;
            setCameraRef(r);
          }
        }}
        makeDefault
        fov={40}
        position={[0, 0, 4]}
      />

      <Branch
        scale={Math.max(1 * aspect, 1.5)}
        rotation={[0, 0, Math.PI * -0.03]}
        position={[-aspect * 1.7, 0.85, 0]}
        variant={0}
        uniforms={bUnifoms}
        branchlets={17}
      />

      <Branch
        scale={Math.max(1 * aspect, 1.5)}
        rotation={[0, Math.PI, 0]}
        position={[aspect * 1.5, -0.7, 0]}
        variant={4}
        uniforms={bUnifoms}
        branchlets={17}
      />

      <Branch
        scale={0.8 * aspect}
        rotation={[0, 0, Math.PI * -0.1]}
        position={[-aspect * 1.48, -2, 0]}
        variant={3}
        uniforms={bUnifoms}
        branchlets={17}
      />

      <Cat position={[-aspect, -4, 0]} scale={[0.04, 0.04, 0.04]} />

      <Branch
        scale={0.8 * aspect}
        rotation={[0, Math.PI, 0]}
        position={[aspect * 1.5, -4, 0]}
        variant={4}
        uniforms={bUnifoms}
        branchlets={17}
      />

      <Branch
        scale={0.8 * aspect}
        rotation={[0, 0, Math.PI * -0.1]}
        position={[-aspect * 1.48, -6, 0]}
        variant={4}
        uniforms={bUnifoms}
        branchlets={17}
      />
    </>
  );
};
