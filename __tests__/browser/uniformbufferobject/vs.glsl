#version 300 es

in vec3 vertexPosition;

layout (std140) uniform param {
  vec4 color;
};

out vec4 vColor;

void main() {
  vColor = color;
  gl_Position = vec4(vertexPosition, 1.0);
}