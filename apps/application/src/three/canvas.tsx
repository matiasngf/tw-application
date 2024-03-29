"use client";

import { Canvas } from "@react-three/fiber";
import { Renderer } from "./renderer";
import { Html } from "@react-three/drei";

export const ThreeCanvas = () => {
  return (
    <div className="w-screen h-screen fixed">
      <Canvas
        className="w-full h-full"
        // onCreated={(state) => {
        //   state.camera.lookAt(0, 2, 0);
        // }}
        // camera={{ fov: 40, position: [2, 2, 2], near: 0.01, far: 20 }}
      >
        <Html></Html>
        <Renderer />
      </Canvas>
    </div>
  );
};
