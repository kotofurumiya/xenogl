#version 300 es
precision highp float;

uniform sampler2D tex;
in vec2 textureCoord;
out vec4 fragmentColor;

void main() {
  fragmentColor = texture(tex, textureCoord);
}