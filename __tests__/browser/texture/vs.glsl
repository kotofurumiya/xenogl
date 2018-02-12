#version 300 es

in vec3 vertexPosition;
in vec2 texCoord;

out vec2 textureCoord;

void main() {
  textureCoord = texCoord;
  gl_Position = vec4(vertexPosition, 1.0);
}
