"use client";

import { Color, PerspectiveCamera as ThreeCamera, SpotLight } from "three";
import { useRef, useState } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Branch, BranchUniformParmas } from "./components/plants/branch";
import { useUniforms } from "./hooks/use-uniforms";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { create } from "zustand";
import { lerp } from "@/transpiled/lerp.emojs";
import { useLenis } from "@studio-freight/react-lenis";
import { DrawPass } from "./shaders/draw-pass";
import { Cats } from "./components/cats";
import tunnel from "tunnel-rat";
import { DesktopPlants } from "./components/desktop-plants";

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

const cameraFov = 30;

function calculateCameraDistance(fovDegrees: number, planeHeight = 1) {
  const fovRadians = (fovDegrees * Math.PI) / 180;
  const halfPlaneHeight = planeHeight / 2;
  const distance = halfPlaneHeight / Math.tan(fovRadians / 2);
  return distance;
}

export const webGlTunnel = tunnel();

export const InnerScene = () => {
  const aspect = useThree((s) => s.viewport.aspect);
  const halfAspect = useThree((s) => s.viewport.aspect / 2);

  const lightRef = useRef<SpotLight | null>(null);
  const [cameraRef, setCameraRef] = useState<ThreeCamera | null>(null);

  const isDesktop = useThree((s) => s.gl.domElement.clientWidth > 1000);

  useFrame(({ scene }) => {
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

  /** Sync scroll with camera */
  useLenis(
    (l) => {
      if (!cameraRef) return;
      const bodyHeight = document.body.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollableVh = bodyHeight / windowHeight;

      const p = l.progress;
      const initialZ = -0.5;
      const finalZ = -scrollableVh + 0.5;

      const newY = lerp(initialZ, finalZ, p);
      cameraRef.position.y = newY;

      DrawPass.uniforms.cameraY.value = newY;
    },
    [cameraRef]
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
        fov={cameraFov}
        position={[0, -0.5, calculateCameraDistance(cameraFov, 1)]}
      />

      <webGlTunnel.Out />

      {/* <mesh position={[0, -0.5, 0]} rotation={[0, 0, 0]}>
        <meshBasicMaterial color="#f00" />
        <planeGeometry args={[aspect, 1]} />
      </mesh>

      <mesh position={[0, -1.5, 0]} rotation={[0, 0, 0]}>
        <meshBasicMaterial color="#0000ff" />
        <planeGeometry args={[aspect, 1]} />
      </mesh>

      <mesh position={[0, -2.5, 0]} rotation={[0, 0, 0]}>
        <meshBasicMaterial color="green" />
        <planeGeometry args={[aspect, 1]} />
      </mesh> */}

      <Branch
        scale={Math.max(aspect * 0.3, 0.7)}
        rotation={[0, 0, Math.PI * -0.03]}
        position={[-halfAspect - 0.1, -0.2, 0]}
        variant={0}
        uniforms={bUnifoms}
        branchlets={17}
      />

      {isDesktop && <DesktopPlants />}
    </>
  );
};
