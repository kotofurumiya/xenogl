#version 300 es

uniform vec2 origin;
uniform float elapsedTimeDelta;

in vec2 particlePosition;
in vec2 particleVelocity;
in float particleAge;
in float particleLife;

out vec2 vertexPosition;
out vec2 vertexVelocity;
out float vertexAge;
out float vertexLife;

void main() {
  if(particleAge > particleLife) {
    vertexPosition = origin;
    vertexVelocity = particleVelocity;
    vertexAge = 0.0;
    vertexLife = particleLife;
  } else {
    vertexPosition = particlePosition + (particleVelocity * elapsedTimeDelta);
    vertexVelocity = particleVelocity;
    vertexAge = particleAge + elapsedTimeDelta;
    vertexLife = particleLife;
  }
}