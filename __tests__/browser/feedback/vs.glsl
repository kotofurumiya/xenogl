#version 300 es

in vec4 vecA;
in vec4 vecB;

out vec4 result;

void main() {
  result = vecA + vecB;
}
