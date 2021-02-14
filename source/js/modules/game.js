const DEFAULT_TIME = 5 * 60 * 1000;

/**
 * таймер игры
 */
class GameTimer {
  constructor(selector, time = DEFAULT_TIME, endCallback = () => null) {
    this.el = document.querySelector(selector);
    this.time = time > DEFAULT_TIME ? DEFAULT_TIME : time;
    this.endCallback = endCallback;
  }

  render(mm, ss) {
    this.el.innerHTML = `<span>${mm.toString().padStart(2, `0`)}</span>:<span>${ss.toString().padStart(2, `0`)}</span>`;
  }

  start() {
    this.endDate = new Date(new Date().getTime() + this.time);
    this.loop();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  loop() {
    const now = new Date();

    const diff = Math.floor((this.endDate.getTime() - now.getTime()) / 1000);
    const mm = Math.floor(diff / 60);
    const ss = Math.floor((diff - mm * 60));

    this.render(mm, ss);

    // проверяем не истекло ли время рендерим и продолжаем
    if (mm > 0 || ss > 0) {
      this.animationId = requestAnimationFrame(this.loop.bind(this));
    } else {
      this.endCallback();
    }
  }
}

let gameTimer;

/**
 * Фабрика создания таймера
 * @param {string} el
 * @param {number} time
 * @return {GameTimer|*}
 */
export default (el, time = DEFAULT_TIME) => {
  if (!gameTimer) {
    gameTimer = new GameTimer(el, time);
    return gameTimer;
  }

  return gameTimer;
};
