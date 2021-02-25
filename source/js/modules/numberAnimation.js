/**
 * Анимация цифр
 * @param {number} from
 * @param {number} to
 * @param {Element} el
 * @param {number} duration ms
 * @param {number} fps
 */
import {animateProgress} from "../helpers/animate";

export const animateNumber = (from = 0, to, el, duration, fps = 12) => {
  return new Promise((resolve) => {
    const render = (p) => {
      el.innerText = Math.ceil(p * to);
    };

    el.innerText = from;

    animateProgress(render, 900, fps).then(() => {
      el.innerText = to;
      resolve();
    });
  });
};

