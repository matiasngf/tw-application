"use client";

import { Canvas } from "@react-three/fiber";
import { Renderer } from "./renderer";
import { Html } from "@react-three/drei";

export const ThreeCanvas = () => {
  return (
    <div className="w-screen h-screen fixed mix-blend-multiply">
      <Canvas className="w-full h-full">
        <Html></Html>
        <Renderer />
      </Canvas>
    </div>
  );
};
