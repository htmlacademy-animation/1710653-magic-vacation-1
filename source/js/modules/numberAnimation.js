/**
 * Анимация цифр
 * @param {number} from
 * @param {number} to
 * @param {Element} el
 * @param {number} duration ms
 * @param {number} fps
 */
export const animateNumber = (from = 0, to, el, duration, fps = 12) => {
  let then = Date.now();
  let currentValue = from;
  const fpsInterval = 1000 / fps;

  // рассчитываем количество шагов с учетом длительности и требуемого FPS
  const step = Math.ceil((to - from) / (fps * duration / 1000));

  const render = () => {
    currentValue += step;
    el.innerText = currentValue > to ? `${to}` : `${currentValue}`;
  };

  // Основной цикл
  const loop = () => {
    const now = Date.now();
    const diff = now - then;

    if (currentValue <= to) {
      requestAnimationFrame(loop);
    }

    if (diff > fpsInterval) {
      then = now - (diff % fpsInterval);
      render();
    }
  };

  loop();
};

