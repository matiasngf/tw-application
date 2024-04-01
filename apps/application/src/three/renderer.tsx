"use client";

import { WebGLRenderTarget } from "three";
import { RenderTexture } from "./components/render-texture";
import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, FXAAShader, ShaderPass } from "three-stdlib";
import { DrawPass } from "./shaders/draw-pass";
import { InnerScene, useInnerScene } from "./inner-scene";

export const Renderer = () => {
  const gl = useThree((s) => s.gl);
  const mainFbo = useMemo(
    () =>
      new WebGLRenderTarget(1, 1, {
        samples: 16,
      }),
    []
  );

  const renderer = useMemo(() => {
    const composer = new EffectComposer(gl);
    composer.addPass(DrawPass);
    DrawPass.uniforms.baseTexture.value = mainFbo.texture;

    const fxaaPass = new ShaderPass(FXAAShader);
    composer.addPass(fxaaPass);

    return {
      composer,
      fxaaPass,
    };
  }, [gl]);

  const resolution = useThree((s) => s.size);

  const pixelRatio = useThree((s) => s.gl.getPixelRatio());

  useFrame(({ gl, size }) => {
    const { composer, fxaaPass } = renderer;

    DrawPass.uniforms.resolution.value = [size.width, size.height];
    fxaaPass.uniforms.resolution.value.set(
      (1 / size.width) * 0.3,
      (1 / size.height) * 0.3
    );
    composer.render();
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
