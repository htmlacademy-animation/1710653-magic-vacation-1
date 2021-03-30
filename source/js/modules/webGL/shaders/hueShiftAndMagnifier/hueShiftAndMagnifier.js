import * as THREE from "three/src/Three";

import vertexShader from './hueShiftAndMagnifier.vert';
import fragmentShader from './hueShiftAndMagnifier.frag';

/**
 * Получение материала с учетом шейдера сдвига HUE
 */
export const getHueShiftAndMagnifier = (texture, shift = 0.33, bubbles = []) => {
  return new THREE.RawShaderMaterial({
    uniforms: {
      map: {
        value: texture
      },
      shift: {
        value: shift
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
