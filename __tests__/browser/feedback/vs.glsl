#version 300 es

in vec4 vecA;
in vec4 vecB;

out vec4 result1;
out vec4 result2;

void main() {
  result1 = vecA + vecB;
  result2 = vecA - vecB;
}
