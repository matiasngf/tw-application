import { CylinderGeometry, GLSL3, LineSegments, Mesh, ShaderMaterial, Texture } from "three";
import { PathVertices, verticesFromLineSegment } from "./path-vertex";
import { branchFragmentShader, branchVertexShader } from "@/three/shaders/branch-shaders";
import { BranchUniforms } from "../branch";

export interface getBranchReult {
  branchMesh: Mesh<CylinderGeometry, ShaderMaterial>
  branchPath: PathVertices
}

/** Transform a lineSegment into a branch mesh */
export const getBranchMesh = (branch: LineSegments, branchUniforms: BranchUniforms, texture: Texture) => {

  const branchPath = verticesFromLineSegment(branch)

  const {
    pathVertices,
    totalDistance,
    numVertices,
  } = branchPath

  /** This material will transform the cylinder geometry to follow the path */
  const branchMaterial = new ShaderMaterial({
    name: branch.name + 'material',
    vertexShader: branchVertexShader,
    fragmentShader: branchFragmentShader,
    glslVersion: GLSL3,
    defines: {
      NUM_VERTICES: numVertices,
    },
    uniforms: {
      map: { value: texture },
      pathVertices: {
        value: pathVertices,
      },
      totalDistance: { value: totalDistance },
      ...branchUniforms,
    },
  });

  const branchResolution = 20;
  const noramlizedCylinder = new CylinderGeometry(1, 1, 1, branchResolution, numVertices * 2);
  const branchMesh = new Mesh(noramlizedCylinder, branchMaterial);

  return {
    branchMesh,
    branchPath,
    position: branch.position,
    rotation: branch.rotation,
  };
}
