precision mediump float;

uniform sampler2D map;

varying vec2 vUv;

uniform float scale;



void main() {
  vec4 texel = texture2D( map, vUv );

  mat4 gray = mat4 (
  scale, scale, scale, 0,
  scale, scale, scale, 0,
  scale, scale, scale, 0,
  0, 0,0, 1
  );

  gl_FragColor = texel * gray;
}
