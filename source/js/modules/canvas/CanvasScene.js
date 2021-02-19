import {animateDuration} from "../../helpers/animate";

export class CanvasScene {
  constructor(options) {
    this.canvas = document.createElement(`canvas`);

    this.updateSceneSize();

    this.ctx = this.canvas.getContext(`2d`);

    this.canvas.width = this.ww;
    this.canvas.height = this.wh;
    this.duration = options.duration;

    document.querySelector(options.el).appendChild(this.canvas);
    window.addEventListener(`resize`, this.updateSceneSize.bind(this));
  }

  drawScene() {
    throw new Error(`need implements drawScene method`);
  }

  /**
   * Поворот контекста на заданный угол относительно точки
   * @param {number} angle
   * @param {number} cx
   * @param {number} cy
   */
  rotateCtx(angle, cx, cy) {
    this.ctx.translate(cx, cy);
    this.ctx.rotate(angle * Math.PI / 180);
    this.ctx.translate(-cx, -cy);
  }

  /**
   * Очистка холста
   */
  clear() {
    const {ww, wh} = this;
    this.ctx.clearRect(0, 0, ww, wh);
  }

  updateSceneSize() {
    this.ww = window.innerWidth;
    this.wh = window.innerHeight;
    this.aspectRation = this.ww / this.wh;
    this.wFactor = this.ww / 1440;
    this.hFactor = this.wh / 760;
  }

  /**
   * Старт анимации
   * @return {Promise<1>}
   */
  startAnimation() {
    const {duration} = this;
    // eslint-disable-next-line no-console
    console.log(`start animation!`);

    this.drawScene();
    return animateDuration(this.globalAnimationTick.bind(this), duration, 60);
  }

  globalAnimationTick() {
    throw new Error(`need implements runAnimation method`);
  }
}
