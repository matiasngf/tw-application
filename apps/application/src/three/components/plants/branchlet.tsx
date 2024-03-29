import { useMemo } from "react";
import {
  getBranchletMesh,
  getBranchletVertices,
} from "./helpers/branchlet-utils";
import { PathVertex } from "./helpers/path-vertex";
import { Leaf } from "./leaf";
import { Texture } from "three";
import { BranchUniforms } from "./branch";

interface BranchletProps {
  pathVertices: PathVertex[];
  uniforms: BranchUniforms;
  t: number;
  texture: Texture;
}

export const Branchlet = ({
  pathVertices,
  uniforms,
  t,
  texture,
}: BranchletProps) => {
  const { branchletMesh, branchletPath, position } = useMemo(() => {
    const branchletVertices = getBranchletVertices(pathVertices, t);
    const branchletMesh = getBranchletMesh(
      branchletVertices.pathVertices,
      t,
      uniforms,
      texture
    );
    return {
      branchletMesh,
      branchletPath: branchletVertices.pathVertices,
      position: branchletVertices.position,
    };
  }, [t, texture]);

  return (
    <>
      <group position={position}>
        <primitive object={branchletMesh} />
        <Leaf t={t} branchletPath={branchletPath} uniforms={uniforms} />
      </group>
    </>
  );
};
