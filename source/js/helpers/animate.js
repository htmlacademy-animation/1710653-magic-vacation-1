/**
 * Хелпер по анимированию с передачей прогресса
 * @param {Function} render
 * @param {number} duration ms
 * @param {number} fpsLimit
 * @return {Promise<1>}
 */
export const animateDuration = (render, duration, fpsLimit = 12) => new Promise((resolve) => {
  let start = Date.now();
  let then = start;
  const fpsInterval = 1000 / fpsLimit;

  (function loop() {
    const now = Date.now();
    const diff = now - then;

    let p = (now - start) / duration;
    if (p > 1) {
      render(duration);
      resolve(1);
    } else {
      requestAnimationFrame(loop);
    }

    // лок на количество кадров
    if (diff > fpsInterval) {
      then = now - (diff % fpsInterval);
      render(p);
    }
  }());
});

/**
 * @param tasks
 * @returns {Promise<void>}
 */
export const runSerial = (tasks) => {
  let result = Promise.resolve();
  tasks.forEach((task) => {
    result = result.then(task);
  });
  return result;
};
