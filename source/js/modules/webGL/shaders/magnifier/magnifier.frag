precision mediump float;

struct buble {
  vec2 center;
  float radius;
};

varying vec2 vTextureCoord;
uniform sampler2D map;
uniform buble bubbles[3];
uniform int bubblesCount;
varying vec2 vUv;

void main(void)
{
  gl_FragColor = texture2D(map, vUv);

  for (int i = 0; i < 10; i++ ) {
    if (i < bubblesCount) {
      vec2 center =  bubbles[i].center;
      float radius = bubbles[i].radius;
      float lens_dist = distance(gl_FragCoord.xy, center.xy);

      if (lens_dist < radius)
      {
        float h = sqrt(1. - pow(lens_dist /  radius, 2.0));

        gl_FragColor = texture2D(map, vUv - (vUv -   center.xy) / 50000. / h);
      }
    }
  }
}
