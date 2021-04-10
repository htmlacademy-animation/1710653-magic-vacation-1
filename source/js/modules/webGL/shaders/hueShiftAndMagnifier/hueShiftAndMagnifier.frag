precision mediump float;

struct buble {
  vec2 center;
  float radius;

};

uniform sampler2D map;

uniform int bubblesCount;
uniform buble bubbles[3];
uniform bool hasBubble;

varying vec2 vUv;

uniform float shift;

vec3 rgb2hsv(vec3 c)
{
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

#define PI 3.1415926538

vec3 hsv2rgb(vec3 c)
{
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}



void main() {
  vec2 uV = vUv; // TODO: Что за переменная vUv? в чем ее отличие от gl_FragCoord.xy ?
  vec4 texel = texture2D( map, uV );
  // TODO: как сделать чтобы был нормально при адаптиве ?
  vec4 VergeColor = vec4(1,1, 0,1);
  float mixColorRate = 0.0;
  // Проходим по линзам
  for (int i = 0; i < 3; i++ ) {
    vec2 center;
    float radius;
    // я хз почему не пашет проверка :) TODO: Спросить у наставника
    if (i < bubblesCount && hasBubble) {
      center =  bubbles[i].center ;
      radius = bubbles[i].radius;
      float lens_dist = distance(gl_FragCoord.xy, center.xy);

      if (lens_dist < radius)
      {
        float h = sqrt(1. - pow(lens_dist /  radius , 2.0));

        texel = texture2D(map, uV - (uV - center.xy) / 50000. / h );
        vec2 p = gl_FragCoord.xy - center.xy;

        float deg = degrees(atan(p.x, p.y));
        if ( (deg >= -50. && deg <= -10.) &&  (lens_dist >= radius * 0.8 && lens_dist <= radius * 0.85 )) {
          mixColorRate = 0.15;
        }
      }

      if (lens_dist <= radius * 1.05 && lens_dist > radius)
      {
        mixColorRate = 0.15;
      }
    }
  }

  vec3 hsv = rgb2hsv(texel.rgb);
  hsv.x = fract(hsv.x + shift);
  vec3 hueColor = hsv2rgb(hsv);
  gl_FragColor = mix(vec4(hueColor.rgb , 1), VergeColor, mixColorRate) ;
}
