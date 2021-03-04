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

    let p = (now - start);
    if (p > duration) {
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


export const animateEasing = (render, duration, easing) => new Promise((resolve) => {
  const start = Date.now();
  (function loop() {
    const p = (Date.now() - start) / duration;
    if (p > 1) {
      render(1);
      // set that animation end
      resolve();
    } else {
      requestAnimationFrame(loop);
      render(easing(p));
    }
  }());
});

// animation using raf (render function parameter is progress from 0 to 1)
export const animateProgress = (render, duration) => new Promise((resolve) => {
  const start = Date.now();
  (function loop() {
    const p = (Date.now() - start) / duration;
    if (p > 1) {
      render(1);
      // set that animation end
      resolve();
    } else {
      requestAnimationFrame(loop);
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

// run promises in sequence one after another
// then check if it's necessery to proceed if there is any checking function
// otherwise proceed anyway
export const runSerialLoop = (tasks, needProceedFunc) => {
  return new Promise((resolve) => {
    runSerial(tasks).then(() => {
      if (typeof needProceedFunc !== 'function' || needProceedFunc()) {
        runSerialLoop(tasks, needProceedFunc);
        return;
      }
      resolve();
    });
  });
};


/**
 * Вычисление параметра по кривой
 * @param p1
 * @param p2
 * @param p3
 * @param p4
 * @returns {function(*): number}
 */
export const bezier = (p1, p2, p3, p4) => (t) => {
  return (1 - t) ** 3 * p1 + 3 * (1 - t) ** 2 * t * p2 + 3 * (1 - t) * t ** 2 * p3 + t ** 3 * p4;
};

/**
 * Вычисление кординат по кривой безье
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param x3
 * @param y3
 * @param x4
 * @param y4
 * @returns {function(*=): {x: number, y: number}}
 */
export const moveByBezier = (
    [
      x1, y1, x2, y2, x3, y3, x4, y4,
    ],
) => (t) => {
  return {
    x: bezier(x1, x2, x3, x4)(t),
    y: bezier(y1, y2, y3, y4)(t)
  };
};

/**
 * Создание паузы
 * @param delay
 * @return {Promise<>}
 */
export const delay = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
