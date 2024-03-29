"use client";

import {
  Color,
  SpotLight,
  PerspectiveCamera as ThreeCamera,
  WebGLRenderTarget,
} from "three";
import { RenderTexture } from "./components/render-texture";
import { useMemo, useRef } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, TexturePass } from "three-stdlib";
import { getDrawPass } from "./shaders/draw-pass";
import { InnerScene } from "./inner-scene";

export const Renderer = () => {
  const gl = useThree((s) => s.gl);
  const mainFbo = useMemo(() => new WebGLRenderTarget(), []);

  const renderer = useMemo(() => {
    const composer = new EffectComposer(gl);
    // const renderScene = new TexturePass(mainFbo.texture);
    // composer.addPass(renderScene);

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
  }, 1);

  return (
    <>
      <RenderTexture
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
