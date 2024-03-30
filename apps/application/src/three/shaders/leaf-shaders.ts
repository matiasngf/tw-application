export const leafVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;

  vNormal = normalMatrix * normal;

  vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}

`

export const leafFragmentShader = /* glsl */ `
out vec4 fragColor;

uniform sampler2D leafTexture;
uniform float leafProgress;

varying vec2 vUv;

vec3 brightnessContrast(vec3 color, float brightness, float contrast) {
  return (color - 0.5) * contrast + 0.5 + brightness;
}

void main() {
  vec4 colorMap = texture2D(leafTexture, vUv).rgba;
  if (colorMap.a < 0.6) discard;
  
  vec3 result = colorMap.rgb;
  vec3 green = vec3(0.2, 0.5, 0.2);

  result = mix(green, result, leafProgress);

  result = brightnessContrast(result, 0.2, 2.5);

  fragColor = vec4(result, colorMap.a);
}

`
