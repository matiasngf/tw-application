import { useGLTF } from "@react-three/drei";
import { GroupProps, useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import {
  AnimationAction,
  AnimationClip,
  AnimationMixer,
  NormalAnimationBlendMode,
  Object3D,
  ShaderMaterial,
  SkinnedMesh,
  Material,
  MeshPhysicalMaterial,
  Color,
  Group,
  AnimationObjectGroup,
} from "three";
import type { GLTF } from "three-stdlib";

import { catBodyFragmentShader, catBodyVertexShader } from "./cat-body-shader";
import { randomItem } from "@/transpiled/random-item.emojs";

interface CatGLTF extends GLTF {
  nodes: {
    Cat: Object3D;
  };
  animations: AnimationClip[];
}

// useGLTF.preload("/cat2.glb");

export interface CatProps extends GroupProps {
  state?: "sleeping" | "idle";
  modelPath?: string;
}

export const Cat = ({ modelPath, state, ...props }: CatProps) => {
  const { nodes, animations } = useGLTF(
    modelPath || "/cat2.glb"
  ) as unknown as CatGLTF;

  const catId = useMemo(() => {
    // generate random Id
    return Math.random().toString(36).substring(7);
  }, []);

  const { MainNode, updateMixer, actions, mixer } = useMemo(() => {
    const stateForced = typeof state !== "undefined";
    /** Perform edits to the cat node, change material and sync animations */
    const MainNode = nodes.Cat;

    // animation mixer
    const mixer = new AnimationMixer(MainNode);

    // actions
    const clipPatita = AnimationClip.findByName(
      animations,
      "sit-patita"
    ).clone();
    const actionPatita = mixer.clipAction(clipPatita);
    actionPatita.repetitions = Infinity;

    const clipSitIdle = AnimationClip.findByName(
      animations,
      "sit-idle"
    ).clone();
    const actionSitIdle = mixer.clipAction(clipSitIdle);
    actionSitIdle.repetitions = Infinity;
    if (stateForced) {
      actionSitIdle.setEffectiveTimeScale(0.5);
    }

    const clipLayDown = AnimationClip.findByName(
      animations,
      "lay-down"
    ).clone();
    clipLayDown.blendMode = NormalAnimationBlendMode;
    const actionLayDown = mixer.clipAction(clipLayDown);
    actionLayDown.repetitions = 1;
    actionLayDown.clampWhenFinished = true;

    const clipSleep = AnimationClip.findByName(animations, "sleep").clone();
    const actionSleep = mixer.clipAction(clipSleep);
    actionSleep.repetitions = Infinity;
    if (stateForced) {
      actionSleep.setEffectiveTimeScale(0.5);
    }

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

    const SkinNode = MainNode.getObjectByName("Object_7") as SkinnedMesh;

    SkinNode.material = new ShaderMaterial({
      fragmentShader: catBodyFragmentShader,
      vertexShader: catBodyVertexShader,
    });

    const EyesNode = MainNode.getObjectByName("Object_8") as SkinnedMesh;
    const eyeMaterial = EyesNode.material as MeshPhysicalMaterial;
    eyeMaterial.map = null;
    eyeMaterial.color = new Color("#777");

    return {
      MainNode,
      updateMixer,
      mixer,
      actions,
    };
  }, [nodes, animations, catId]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const isCancelled = signal.aborted;

    let isSleeping =
      typeof state === "undefined"
        ? randomItem([true, false])
        : state === "sleeping";
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
      }, 30 * 1000);
    };
    if (typeof state === "undefined") {
      sleepTicker();
    }

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
  }, [actions, mixer, state]);

  useFrame((_state, delta) => {
    updateMixer(delta);
  });

  return (
    <group {...props}>
      <group scale={[0.04, 0.04, 0.04]}>
        <primitive object={MainNode} />
      </group>
    </group>
  );
};
