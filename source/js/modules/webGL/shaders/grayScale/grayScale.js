import * as THREE from "three/src/Three";

import vertexShader from './grayScale.vert';
import fragmentShader from './grayScale.frag';

/**
 * Получение материала с учетом шейдера сдвига HUE
 */
export const geGrayScaleMaterial = (texture, scale = 0.33) => {
  return new THREE.RawShaderMaterial({
    uniforms: {
      map: {
        value: texture
      },
      scale: {
        value: scale
      }
    },
    side: THREE.DoubleSide,
    transparent: true,
    vertexShader,
    fragmentShader
  });
};
