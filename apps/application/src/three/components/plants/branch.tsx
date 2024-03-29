import {
  LineSegments,
  Mesh,
  MirroredRepeatWrapping,
  RepeatWrapping,
  Texture,
} from "three";
import { useMemo } from "react";
import { getBranchMesh } from "./helpers/get-branch-mesh";
import { Branchlet } from "./branchlet";
import { useGLTF, useTexture } from "@react-three/drei";
import { Uniforms } from "@/three/hooks/use-uniforms";
import { GLTF, GLTFLoader } from "three-stdlib";
import { GroupProps, useLoader } from "@react-three/fiber";
import { clamp } from "three/src/math/MathUtils.js";

const branchUniforms = {
  progress: 0,
  branchRadius: 0.005,
  branchGrowOffset: 0,
};

export type BranchUniformParmas = typeof branchUniforms;

export type BranchUniforms = Uniforms<typeof branchUniforms>;

export interface PlantGLTF extends GLTF {
  nodes: {
    pot: Mesh;
    stick: Mesh;
    Branch: LineSegments;
    leaf: Mesh;
  };
}

useGLTF.preload("/plant.glb");

export interface BranchProps extends GroupProps {
  variant: number;
  uniforms: BranchUniforms;
  branchlets: number;
}

export const Branch = ({
  variant,
  uniforms,
  branchlets,
  ...groupProps
}: BranchProps) => {
  const plantModel = useLoader(
    GLTFLoader,
    "/plant.glb"
  ) as unknown as PlantGLTF;

  const branchMap = useTexture("/branch-texture.jpg", (t: Texture) => {
    t.wrapT = RepeatWrapping;
    t.wrapS = MirroredRepeatWrapping;
  });

  const props = useMemo(() => {
    // handle loading state
    if (!plantModel?.nodes) return null;

    const segment = Object.values(plantModel.nodes).find(
      (n) => n.name === `Branch${variant}`
    ) as LineSegments | undefined;

    if (!segment) {
      throw new Error(`Branch variant ${variant} does not exist`);
    }

    return getBranchMesh(segment.clone(true), uniforms, branchMap);
  }, [plantModel]);

  const branchletsArr = useMemo(() => {
    const ts = Array.from(Array(branchlets).keys()).map((_, i) => {
      const currentPos = i / branchlets;
      const randomOffset = (Math.random() - 0.5) * 0.1;
      const pos = clamp(currentPos + randomOffset, 0, 1);
      return pos;
    });
    // add a final branchlet at the end
    ts.push(0.99);
    return ts;
  }, [branchlets]);

  if (!props) return null;

  const { branchMesh, branchPath } = props;

  return (
    <>
      <group {...groupProps}>
        {<primitive object={branchMesh} />}
        {branchletsArr.map((t, i) => (
          <Branchlet
            pathVertices={branchPath.pathVertices}
            uniforms={uniforms}
            texture={branchMap}
            t={t}
            key={i}
          />
        ))}
      </group>
    </>
  );
};
