import * as THREE from "three/src/Three";

import vertexShader from './hueShift.vert';
import fragmentShader from './hueShift.frag';

/**
 * Получение материала с учетом шейдера сдвига HUE
 */
export const getHueShiftMaterial = (texture, shift = 0.33) => {
  return new THREE.RawShaderMaterial({
    uniforms: {
      map: {
        value: texture
      },
      shift: {
        value: shift
      }
    },
    side: THREE.DoubleSide,
    transparent: true,
    vertexShader,
    fragmentShader
  });
};
