import * as THREE from "three/src/Three";

import vertexShader from './magnifier.vert';
import fragmentShader from './magnifier.frag';

/**
 * Получение материала с учетом шейдера сдвига HUE
 */
export const geMagnifierMaterial = (texture, bubbles = []) => {
  return new THREE.RawShaderMaterial({
    uniforms: {
      map: {
        value: texture
      },
      bubbles: {
        value: bubbles
      },
      bubblesCount: {
        value: bubbles.length
      },
      hasBubble: {
        value: !!bubbles.length
      }
    },
    side: THREE.DoubleSide,
    transparent: true,
    vertexShader,
    fragmentShader
  });
};
