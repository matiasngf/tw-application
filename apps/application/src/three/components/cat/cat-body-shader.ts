import { valueRemap } from "@/three/shaders/frags/value-remap"

export const catBodyVertexShader = /* glsl */ `

varying vec2 vUv;
varying vec3 vViewPosition;

#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {
  vUv = uv;
  #include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}
`

export const catBodyFragmentShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;

${valueRemap}

void main() {

	vec3 lightDirection = normalize(vec3(5.0, 4.0, 5.0));

	float light = dot(vNormal, lightDirection);
	light = valueRemap(light, 0.5, 0.6, 0.0, 1.0);
	light = clamp(light, 0.0, 1.0);

	vec3 light2Direction = normalize(vec3(5.0, 4.0, 4.0));
	float light2 = dot(vNormal, light2Direction);
	light2 = valueRemap(light2, 0.5, 0.9, 0.0, 1.0);
	light2 = clamp(light2, 0.5, 1.0);

	vec3 frag = vec3(0.565);
	frag *= light;
	frag *= light2;

	float lighten = valueRemap(vUv.y, 0.7, 1.0, 0.0, 1.0);
	lighten = clamp(lighten, 0.0, 0.3);

	// frag += vec3(lighten);

  gl_FragColor = vec4(frag, 1.0);
}
`
