#version 300 es

in vec3 vertexPosition;
in vec4 color;

out vec4 vColor;

void main() {
  vColor = color;
  gl_Position = vec4(vertexPosition, 1.0);
}