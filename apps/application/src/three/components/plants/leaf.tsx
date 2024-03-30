import { useLoader } from "@react-three/fiber";
import { PathVertices } from "./helpers/path-vertex";
import { GLTFLoader } from "three-stdlib";
import { useEffect, useMemo } from "react";
import {
  AxesHelper,
  CatmullRomCurve3,
  DoubleSide,
  GLSL3,
  MeshStandardMaterial,
  Quaternion,
  ShaderMaterial,
  Vector3,
} from "three";
import { BranchUniforms, PlantGLTF } from "./branch";
import { useUniforms } from "@/three/hooks/use-uniforms";
import {
  leafFragmentShader,
  leafVertexShader,
} from "@/three/shaders/leaf-shaders";
import { valueRemap } from "@/lib/math/value-remap";
import { clamp } from "three/src/math/MathUtils.js";
import { easeOut } from "@/lib/math/ease";

export interface LeafProps {
  branchletPath: PathVertices;
  uniforms: BranchUniforms;
  /** Where in the main branch the branchlet starts */
  t: number;
}

export const Leaf = ({ branchletPath, uniforms, t }: LeafProps) => {
  const plantModel = useLoader(
    GLTFLoader,
    "/plant.glb"
  ) as unknown as PlantGLTF;

  const [leafUniforms, setLeafUniforms] = useUniforms({
    leafProgress: 0,
  });

  const modelNode = useMemo(() => {
    const leaf = plantModel.nodes.leaf.clone();
    const leafMaterial = leaf.material as MeshStandardMaterial;
    const leafTexture = leafMaterial.map!.clone();
    leafTexture.colorSpace = "srgb-linear";

    leaf.material = new ShaderMaterial({
      side: DoubleSide,
      transparent: true,
      vertexShader: leafVertexShader,
      fragmentShader: leafFragmentShader,
      glslVersion: GLSL3,
      uniforms: {
        ...leafUniforms,
        leafTexture: {
          value: leafTexture,
        },
      },
    });

    return leaf;
  }, [plantModel, branchletPath, uniforms, t]);

  const helper = useMemo(() => {
    return new AxesHelper(0.1);
  }, []);

  useEffect(() => {
    if (!modelNode) return;

    const abortController = new AbortController();
    const signal = abortController.signal;
    const isCanceled = () => signal.aborted;

    const curve = new CatmullRomCurve3(
      branchletPath.pathVertices.map((v) => v.position)
    );

    let prevProgress: number | null = null;

    const raf = () => {
      if (isCanceled()) return;
      const currentProgress = uniforms.progress.value;
      if (prevProgress === currentProgress) {
        requestAnimationFrame(raf);
        return;
      }

      const tStart = t + 0.1;
      const tEnd = t + 0.3;
      let branchletProgress = valueRemap(currentProgress, tStart, tEnd, 0, 1);
      branchletProgress = clamp(branchletProgress, 0, 1);
      branchletProgress = easeOut(branchletProgress);

      // move model along branchlet path
      const point = curve.getPointAt(branchletProgress);
      const startingDirection = curve.getTangentAt(0);
      const endDirection = curve.getTangentAt(1);
      const branchDirection = startingDirection.lerp(
        endDirection,
        branchletProgress
      );
      const branchCurrentDirection = curve.getTangentAt(branchletProgress);
      branchDirection.lerp(branchCurrentDirection, 0.01);
      modelNode.position.copy(point);
      helper.position.copy(point);

      // rotate model to face branch direction
      const leafDirection = new Vector3(1, 0, 0).normalize();
      const axis = new Vector3()
        .crossVectors(leafDirection, branchDirection)
        .normalize();
      const angle = Math.acos(leafDirection.dot(branchDirection));
      modelNode.quaternion.setFromAxisAngle(axis, angle);
      helper.quaternion.setFromAxisAngle(axis, angle);

      // make the leaf face the camera
      const xAxis = new Vector3(1, 0, 0); // Global X axis
      const xAngle = -0.8;
      const xQuaternion = new Quaternion().setFromAxisAngle(xAxis, xAngle);

      modelNode.quaternion.premultiply(xQuaternion);

      // scale
      modelNode.scale.setScalar(branchletProgress * 1.5);

      // update progress
      prevProgress = currentProgress;
      setLeafUniforms({ leafProgress: branchletProgress });

      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      abortController.abort();
    };
  }, [uniforms, branchletPath, t, modelNode]);

  return (
    <group rotation={[0, 0, 0]}>
      <primitive object={modelNode} />
    </group>
  );
};
