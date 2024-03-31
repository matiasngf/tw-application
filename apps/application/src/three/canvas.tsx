"use client";

import { Canvas } from "@react-three/fiber";
import { Renderer } from "./renderer";
import { Html } from "@react-three/drei";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const ThreeCanvas = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      gsap.to(containerRef.current, {
        opacity: 1,
        duration: 0.5,
        delay: 0.2,
      });
    },
    {
      scope: containerRef,
    }
  );

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen fixed mix-blend-multiply opacity-0"
    >
      <Canvas className="w-full h-full">
        <Html></Html>
        <Renderer />
      </Canvas>
    </div>
  );
};
