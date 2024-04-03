"use client";

import { useThree } from "@react-three/fiber";
import { Branch, BranchUniformParmas } from "./plants/branch";
import { useUniforms } from "../hooks/use-uniforms";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMemo } from "react";

const scaler = 0.7;

export const DesktopPlants = () => {
  const halfAspect = useThree((s) => s.viewport.aspect / 2);
  const yFactor = useThree((s) => 1000 / s.gl.domElement.clientHeight);
  1;
  const clientWidth = useThree((s) => s.gl.domElement.clientWidth);
  const clientHeight = useThree((s) => s.gl.domElement.clientHeight);

  const plantScale = useMemo(() => {
    const margin = Math.min(clientWidth - 640, 800);
    const marginSize = margin / clientHeight;
    return marginSize * scaler;
  }, [scaler, clientWidth, clientHeight]);

  const [bUnifoms] = useUniforms({
    branchGrowOffset: 0,
    branchRadius: 0.002,
    progress: 0,
  } satisfies BranchUniformParmas);

  useGSAP(() => {
    gsap.to(bUnifoms.progress, {
      value: 1.5,
      delay: 2,
      duration: 10,
      ease: `power1.out`,
    });
  });

  return (
    <>
      <Branch
        scale={plantScale}
        rotation={[0, Math.PI, Math.PI * -0.15]}
        position={[halfAspect, -0.8, 0]}
        variant={2}
        uniforms={bUnifoms}
        branchlets={17}
      />

      <Branch
        scale={plantScale}
        rotation={[0, 0, Math.PI * -0.1]}
        position={[-halfAspect, -1.2 * yFactor, 0]}
        variant={3}
        uniforms={bUnifoms}
        branchlets={20}
      />

      <Branch
        scale={plantScale}
        rotation={[0, Math.PI, Math.PI * -0.15]}
        position={[halfAspect, -3 * yFactor, 0]}
        variant={2}
        uniforms={bUnifoms}
        branchlets={25}
      />

      <Branch
        scale={plantScale}
        rotation={[0, 0, Math.PI * -0.1]}
        position={[-halfAspect, -3.2 * yFactor, 0]}
        variant={4}
        uniforms={bUnifoms}
        branchlets={20}
      />

      <Branch
        scale={plantScale}
        rotation={[0, Math.PI, 0]}
        position={[halfAspect, -4.5 * yFactor, 0]}
        variant={5}
        uniforms={bUnifoms}
        branchlets={20}
      />

      <Branch
        scale={plantScale}
        rotation={[0, 0, Math.PI * -0.1]}
        position={[-halfAspect, -7 * yFactor, 0]}
        variant={4}
        uniforms={bUnifoms}
        branchlets={20}
      />

      <Branch
        scale={plantScale}
        rotation={[0, Math.PI, Math.PI * -0.15]}
        position={[halfAspect, -8 * yFactor, 0]}
        variant={2}
        uniforms={bUnifoms}
        branchlets={25}
      />
    </>
  );
};
