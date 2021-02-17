/**
 * Анимация цифр
 * @param {number} from
 * @param {number} to
 * @param {Element} el
 * @param {number} duration ms
 * @param {number} fps
 */
import {animateDuration} from "../helpers/animate";

export const animateNumber = (from = 0, to, el, duration, fps = 12) => {
  return new Promise((resolve) => {
    const render = (p) => {
      el.innerText = Math.ceil(p * to);
    };

    el.innerText = from;

    animateDuration(render, 900, fps).then(() => {
      el.innerText = to;
      resolve();
    });
  });
};

