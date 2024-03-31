"use client";

import { WebGLRenderTarget } from "three";
import { RenderTexture } from "./components/render-texture";
import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer } from "three-stdlib";
import { getDrawPass } from "./shaders/draw-pass";
import { InnerScene, useInnerScene } from "./inner-scene";

export const Renderer = () => {
  const gl = useThree((s) => s.gl);
  const mainFbo = useMemo(() => new WebGLRenderTarget(), []);

  const innerCameraRef = useInnerScene((s) => s.cameraRef);

  const renderer = useMemo(() => {
    const composer = new EffectComposer(gl);
    const drawPass = getDrawPass(mainFbo.texture);
    composer.addPass(drawPass);

    return {
      composer,
      drawPass,
    };
  }, [gl]);

  const resolution = useThree((s) => s.size);

  const pixelRatio = useThree((s) => s.gl.getPixelRatio());

  useFrame(({ gl }) => {
    const { composer, drawPass } = renderer;
    const width = gl.domElement.width;
    const height = gl.domElement.height;

    composer.render();
    drawPass.uniforms.resolution.value = [width, height];

    if (innerCameraRef.current) {
      drawPass.uniforms.cameraY.value = innerCameraRef.current.position.y;
    }
  }, 1);

  return (
    <>
      <RenderTexture
        renderPriority={1}
        width={resolution.width * pixelRatio}
        height={resolution.height * pixelRatio}
        attach={null}
        isPlaying
        fbo={mainFbo}
      >
        <InnerScene />
      </RenderTexture>
    </>
  );
};
