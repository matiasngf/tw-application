import { CylinderGeometry, Euler, GLSL3, Mesh, Quaternion, ShaderMaterial, Texture, Vector3 } from "three";
import { PathVertex, PathVertices, getPathVertex, vectorsToPathVertices } from "./path-vertex";
import { BranchUniforms } from "../branch";
import { branchletFragmentShader, branchletVertexShader } from "@/three/shaders/branchlet-shaders";

export const getBranchletMesh = (path: PathVertices, t: number, uniforms: BranchUniforms, texture: Texture): Mesh => {

  const branchletGeometry = new CylinderGeometry(1, 1, 1, 10, path.numVertices * 2);
  const branchletMaterial = new ShaderMaterial({
    vertexShader: branchletVertexShader,
    fragmentShader: branchletFragmentShader,
    glslVersion: GLSL3,
    defines: {
      NUM_VERTICES: path.numVertices,
    },
    uniforms: {
      ...uniforms,
      map: { value: texture },
      pathVertices: {
        value: path.pathVertices,
      },
      tStart: { value: t + 0.1 },
      tEnd: { value: t + 0.3 },
      totalDistance: { value: path.totalDistance },
    },
  });
  const branchletMesh = new Mesh(branchletGeometry, branchletMaterial);

  return branchletMesh;
}

/** Generates a branchlet that will start at the same direction/position of the branch at t */
export const getBranchletVertices = (pathVertices: PathVertex[], t: number) => {

  const branchletVertices: Vector3[] = [];

  const {
    direction,
    position
  } = getPathVertex(pathVertices, t);

  const currentDireciton = direction.clone();

  const angleY = (Math.random() - 0.5) * Math.PI * 0.15;
  const initialRotationQuaterinon = new Quaternion();
  initialRotationQuaterinon.setFromAxisAngle(new Vector3(0, 0, 1), angleY);

  const currentPosition = new Vector3(0, 0, 0);
  const randomRotation = new Quaternion();

  // first vertex
  branchletVertices.push(currentPosition.clone());

  const randomFactor = 0.1;
  const numVertices = 10;
  const edgeLength = 0.02;

  for (let i = 0; i < numVertices - 1; i++) {

    const progress = i / numVertices;
    const randomProgress = randomFactor * Math.pow(progress, 2)

    // rotate direction
    randomRotation.setFromEuler(new Euler(
      (Math.random() - 0.5) * 2 * Math.PI * randomProgress,
      (Math.random() - 0.5) * 0.1 * Math.PI * randomProgress,
      (Math.random() - 0.5) * 0.3 * Math.PI * randomProgress,
    ));

    currentDireciton.applyQuaternion(randomRotation);
    currentDireciton.applyQuaternion(initialRotationQuaterinon);

    // smoot Y over time
    // const branchProgress = (i + 1) / numVertices;
    // const growOffset = 0.7;
    // const cap = 0.2;
    // const yFactor = Math.cos(branchProgress * Math.PI * growOffset) * cap + (1 - cap);
    // currentDireciton.y = currentDireciton.y * yFactor;
    // currentDireciton.normalize();

    // move vertex
    currentPosition.add(currentDireciton.clone().multiplyScalar(edgeLength));

    // add vertex
    branchletVertices.push(currentPosition.clone());

  }

  return {
    pathVertices: vectorsToPathVertices(branchletVertices),
    position,
  }

}
