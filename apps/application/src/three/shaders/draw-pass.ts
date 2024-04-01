import { ShaderMaterial, Texture } from "three"
import { ShaderPass } from "three-stdlib"
import { noise2 } from "./frags/noise"

const drawVertexShader = /*glsl*/`
uniform vec2 resolution;
uniform float cameraY;

varying vec2 vUv;
varying vec2 translatedUv;
varying vec2 vAspectUV;
varying vec2 translatedAspectUV;

void main() {
  float translateFactor = 1.;
  float aspect = resolution.x / resolution.y;
  vUv = uv;
  translatedUv = uv + vec2(0.0, cameraY * translateFactor);
  vAspectUV = uv * vec2(aspect, 1.0);
  translatedAspectUV = translatedUv * vec2(aspect, 1.0);

  gl_Position = vec4(position, 1.0);
}
`

const drawFragmentShader =  /*glsl*/`

uniform sampler2D baseTexture;
uniform float time;
uniform vec2 resolution;

#define PI 3.14159265359

varying vec2 vUv;
varying vec2 translatedUv;
varying vec2 vAspectUV;
varying vec2 translatedAspectUV;


${noise2}

float valueRemap(float value, float low1, float high1, float low2, float high2) {
  return low2 + (value - low1) * (high2 - low2) / (high1 - low1);
}

float colorToGrayscale(vec3 color) {
  return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
}

float brightness(float color, float gain) {
  float c = color;
  c *= gain;
  c = clamp(c, 0.0, 1.0);
  return c;
}

float contrast(float color, float contrast) {
  return (color - 0.5) * contrast + 0.5;
}

float luminance(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

float crossHatch(vec2 uv, float lum) {
  float aspect = resolution.x / resolution.y;

  float lineDensity = 0.; // Increase lines in darker areas
  float count = 30.0; // Number of line sets, adjust for finer/coarser hatching


  // Ensure lineWidth is positive and non-zero to avoid division by zero errors
  float lineWidth = 0.03;

  float baseAngle = PI / 0.3; // Base angle of lines

    // Iterate over each set of lines
  for (float i = 0.0; i < count; i++) {

    float lineThreashold = i / count;

    if(1.- lum <= lineThreashold) {
      break;
    }

    float angleVariation = valueRemap(lum, 0., 1., 0.95, 1.0);

    float angle = baseAngle + (PI * angleVariation) / count * i; // Rotate each set of lines

    float s = sin(angle), c = cos(angle);
    uv = uv * mat2(c, -s, s, c);
    
    // Calculate line presence with adjusted line width
    float presence = abs(mod(uv.x, 1.0) - 0.5);
    float line = step(lineWidth, presence); // Control line width via step threshold
    line = 1. - line; // Invert line presence
    lineDensity += line; // Accumulate line presence
  }

  // Normalize line density
  lineDensity = valueRemap(lineDensity, 0., count, 0., count);
  lineDensity = clamp(lineDensity, 0., 1.);

  return lineDensity;
}


// original
vec3 getDraw() {

  vec4 texColor = texture2D(baseTexture, vUv);
  
  float lum = luminance(texColor.rgb);
  float originalLum = lum;
  lum = contrast(lum, 1.2);
  lum = brightness(lum, 3.0);

  float hatch = crossHatch(vAspectUV * 70., lum);
  hatch = 1. - (hatch * 0.5);

  vec3 finalColor = vec3(originalLum * 2.5 * hatch);
  
  // add color
  finalColor = mix(finalColor, texColor.rgb, 0.4 * hatch);

  return finalColor;
}

vec3 getDraw2() {

  vec4 texColor = texture2D(baseTexture, vUv);

  bool hasColor = abs(texColor.r - texColor.g) > 0.05 || abs(texColor.r - texColor.b) > 0.05;
  
  float lum = luminance(texColor.rgb);
  float originalLum = lum;

  lum = valueRemap(lum, 0., 0.4, 0., 1.);
  float hatchFactor = crossHatch(translatedAspectUV * 100., lum);
  float hatch = 1. - hatchFactor;

  float n = cnoise(translatedAspectUV * 900.) * .5 + .5;
  float penShade = originalLum + n;
  penShade = clamp(penShade, 0., 1.);

  float f = penShade * hatch;

  vec3 penColor;

  if(hasColor) {
    penColor = mix(texColor.rgb, vec3(1), f);
  } else {
    penColor = mix(texColor.rgb, vec3(1), f) * hatch;
  }

  return vec3(penColor);

}

void main() {
  gl_FragColor.rgb = getDraw2();
  // DEBUG
  // gl_FragColor.rgb = vec3(lum);
  // gl_FragColor.rgb = vec3(originalLum);
  // gl_FragColor.rgb = texColor.rgb;
  gl_FragColor.a = 1.;
}
`

export const getDrawPass = () => {
  const drawMaterial = new ShaderMaterial({
    vertexShader: drawVertexShader,
    fragmentShader: drawFragmentShader,
    uniforms: {
      baseTexture: { value: null },
      time: { value: 1 },
      resolution: { value: [1920, 1080] },
      cameraY: { value: 0 },
    }
  })

  const drawPass = new ShaderPass(drawMaterial)

  return drawPass
}

export const DrawPass = getDrawPass()
