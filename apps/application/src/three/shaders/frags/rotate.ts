export const rotate = /*glsl*/ `
vec4 getQuaternionFromVectors(vec3 fromVector, vec3 toVector) {
	vec3 crossProduct = cross(fromVector, toVector);
	float dotProduct = dot(fromVector, toVector);
	float angle = acos(dotProduct);
	float halfAngle = angle * 0.5;
	float s = sin(halfAngle);
	vec4 quaternion = vec4(crossProduct * s, cos(halfAngle));
	return normalize(quaternion);
}

// https://community.khronos.org/t/quaternion-functions-for-glsl/50140/3
vec3 qtransform( vec4 q, vec3 v ){ 
	return v + 2.0*cross(cross(v, q.xyz ) + q.w*v, q.xyz);
} 

mat3 rotate(mat3 m, float angle, vec3 axis) {
	float c = cos(angle);
	float s = sin(angle);
	float t = 1.0 - c;

	vec3 normalizedAxis = normalize(axis);
	float x = normalizedAxis.x;
	float y = normalizedAxis.y;
	float z = normalizedAxis.z;

	mat3 rotationMatrix = mat3(
			t * x * x + c, t * x * y - s * z, t * x * z + s * y,
			t * x * y + s * z, t * y * y + c, t * y * z - s * x,
			t * x * z - s * y, t * y * z + s * x, t * z * z + c
	);

	return rotationMatrix * m;
}

vec3 rotateToY(vec3 v, vec3 newY) {
	vec3 currentY = vec3(0, 1, 0);
	vec3 rotationAxis = cross(currentY, newY);
	float rotationAngle = acos(dot(currentY, newY));

	// Apply the rotation using a rotation matrix
	mat3 rotationMatrix = mat3(1.0);
	rotationMatrix = rotate(rotationMatrix, rotationAngle, rotationAxis);

	// Apply the rotation to the vector
	vec3 rotatedVector = rotationMatrix * v;

	return rotatedVector;
}
`
