/**
 * Объект для ортисовки на canvas
 */
export class CanvasSceneObject {
  /**
   * Конструктор объекта
   * @param {HTMLImageElement | null} imageObject
   * @param {number} posX
   * @param {number} posY
   * @param {number} angle
   * @param {number} opacity
   * @param {number} scale
   */
  constructor(
      imageObject = null,
      posX = 0,
      posY = 0,
      angle = 0,
      opacity = 1,
      scale = 1
  ) {
    this.imageObject = imageObject;
    this.posX = posX;
    this.posY = posY;
    this.angle = angle;
    this.opacity = opacity;
    this.width = 0;
    this.height = 0;
    this.scale = scale;

    if (this.imageObject) {
      this.imageObject.addEventListener(`load`, this.setAspectRatio.bind(this));
    }
  }

  /**
   * Получение коэфициента соотношения сторон
   */
  setAspectRatio() {
    const {width, height} = this.imageObject;
    this.aspectRatio = height / width;
  }

  /**
   * Устанавливаем размеры объекта
   * @param {number} width
   * @param {number} height
   */
  setDimensions(width = 0, height = 0) {
    this.width = width;
    this.height = height;
  }
}
