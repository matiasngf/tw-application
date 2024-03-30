import { useGLTF } from "@react-three/drei";
import { GroupProps, useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  NormalAnimationBlendMode,
  type Object3D,
  ShaderMaterial,
  SkinnedMesh,
  Material,
  MeshPhysicalMaterial,
  Color,
} from "three";
import type { GLTF } from "three-stdlib";

import { catBodyFragmentShader, catBodyVertexShader } from "./cat-body-shader";
import { randomItem } from "@/lib/math/random-item";

interface CatGLTF extends GLTF {
  nodes: {
    Cat: Object3D;
  };
  animations: AnimationClip[];
}

useGLTF.preload("/cat2.glb");

export const Cat = (props: GroupProps) => {
  const { nodes, animations } = useGLTF("/cat2.glb") as unknown as CatGLTF;

  const { SceneNode, updateMixer, actions, mixer } = useMemo(() => {
    // animation mixer
    const mixer = new AnimationMixer(nodes.Cat);

    // actions
    const clipPatita = AnimationClip.findByName(animations, "sit-patita");
    const actionPatita = mixer.clipAction(clipPatita);
    actionPatita.repetitions = Infinity;

    const clipSitIdle = AnimationClip.findByName(animations, "sit-idle");
    const actionSitIdle = mixer.clipAction(clipSitIdle);
    actionSitIdle.repetitions = Infinity;

    const clipLayDown = AnimationClip.findByName(animations, "lay-down");
    clipLayDown.blendMode = NormalAnimationBlendMode;
    const actionLayDown = mixer.clipAction(clipLayDown);
    actionLayDown.repetitions = 1;
    actionLayDown.clampWhenFinished = true;

    const clipSleep = AnimationClip.findByName(animations, "sleep");
    const actionSleep = mixer.clipAction(clipSleep);
    actionSleep.repetitions = Infinity;

    const actions = {
      patita: actionPatita,
      sitIdle: actionSitIdle,
      layDown: actionLayDown,
      sleep: actionSleep,
    } as const;

    // updater
    const updateMixer = (delta: number) => {
      mixer.update(delta);
    };

    const SkinNode = nodes.Cat.getObjectByName("Object_7") as SkinnedMesh;
    SkinNode.castShadow = true;

    SkinNode.material = new ShaderMaterial({
      fragmentShader: catBodyFragmentShader,
      vertexShader: catBodyVertexShader,
    });

    const EyesNode = nodes.Cat.getObjectByName("Object_8") as SkinnedMesh;
    const eyeMaterial = EyesNode.material as MeshPhysicalMaterial;
    eyeMaterial.map = null;
    eyeMaterial.color = new Color("#777");

    const MainNode = nodes.Cat;
    MainNode.castShadow = true;

    return {
      SceneNode: MainNode,
      updateMixer,
      mixer,
      actions,
    };
  }, [nodes, animations]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const isCancelled = signal.aborted;

    let isSleeping = randomItem([true, false]);
    isSleeping = false;
    let currentAnimation = isSleeping ? actions.sleep : actions.sitIdle;

    const changeAnimation = (newAnimation: AnimationAction) => {
      if (isCancelled) return;
      if (newAnimation === currentAnimation) return;

      newAnimation.reset();
      newAnimation.crossFadeFrom(currentAnimation, 0.7, true);
      newAnimation.play();
      currentAnimation = newAnimation;
    };

    const setSleep = (newSleep: boolean) => {
      isSleeping = newSleep;
      changeAnimation(isSleeping ? actions.layDown : actions.sitIdle);
    };

    const initAnimations = () => {
      currentAnimation.play();
    };
    initAnimations();

    const sleepTicker = () => {
      setTimeout(() => {
        if (isCancelled) return;
        setSleep(!isSleeping);
        sleepTicker();
      }, 90 * 1000);
    };
    sleepTicker();

    // listen for chain animations
    mixer.addEventListener("finished", (e) => {
      // after lay down, sleep
      if (e.action === actions.layDown) {
        changeAnimation(actions.sleep);
      }
    });

    return () => {
      abortController.abort();
    };
  }, [actions, mixer]);

  useFrame((_state, delta) => {
    updateMixer(delta);
  });

  return (
    <group scale={[0.1, 0.1, 0.1]} {...props}>
      <primitive object={SceneNode} />
    </group>
  );
};
