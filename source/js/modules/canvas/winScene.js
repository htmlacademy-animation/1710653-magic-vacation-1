/**
 * Базовый класс для работы со сценами вариантов завершения игры
 */
import {animateDuration, animateEasing, moveByBezier, runSerial, runSerialLoop} from "../../helpers/animate";
import {preloadImage} from "../../helpers/preloadImage";
import {bezierEasing} from "../../helpers/cubic-bezier";
import {CanvasScene} from "./CanvasScene";
import {CanvasSceneObject} from "./canvasSceneObject";

const WIN_SCENE_PARAMS = {
  seaCalfWidth: 486,
  iceWidth: 408,
  snowflakeWidth: 225, // 12.5
  snowflake2Width: 175, // -175
  treeWidth: 50,
  tree2Width: 38,
  airplaneWidth: 134,
};

const cloud = {
  circle: {
    r: 160,
    x: 505 + 160,
    y: 280 + 160,
  },
};

/**
 * Сцена анимации выигрыша
 */
export class WinScene extends CanvasScene {
  constructor(options) {
    super(options);

    // Фомируем объекты с изображениями
    this.seaCalf = new CanvasSceneObject(new Image(), 465, 230, 20, 1);
    this.ice = new CanvasSceneObject(new Image(), 515, 455, 20, 1);
    this.tree = new CanvasSceneObject(new Image(), 0, 0, 0, 0);
    this.tree2 = new CanvasSceneObject(new Image(), 0, 0, 0, 0);
    // Добавляем объект самолета с начальными параметрами
    this.airplane = new CanvasSceneObject(new Image(), 0, 0, 0, 0);

    // Общая картинка для снежинок
    this.snowflake = new Image();
    this.snowflakeFirst = new CanvasSceneObject(this.snowflake, 0, 0, -12.5, 0);
    this.snowflakeSecondary = new CanvasSceneObject(this.snowflake, 0, 0, -175, 0);

    this.runAnimations = [];

    this.cloudCircleCenterX = 0;
    this.cloudCircleCenterY = 0;
    this.cloudCircleRadius = 0;

    this.drawScene = this.drawScene.bind(this);
    this.prepareScene();
  }

  /**
   * Подготовка к отрписовке сцены
   * @return {Promise<void>}
   */
  async prepareScene() {
    // Загружаем картинки
    await this.loadImages();

    this.updateSeaCalfAndIceSizing();
    this.updateSnowflakesSizing();
    this.updateTreeSizing();
    this.updateAirplaneSizing();

    this.drawScene();
  }

  /**
   * загрузка картинок
   * @return {Promise<images[]>}
   */
  loadImages() {
    return Promise.all(
        [
          preloadImage(`./img/module-4/win-primary-images/sea-calf-2.png`, this.seaCalf.imageObject),
          preloadImage(`./img/module-4/win-primary-images/tree.png`, this.tree.imageObject),
          preloadImage(`./img/module-4/win-primary-images/tree 2.png`, this.tree2.imageObject),
          preloadImage(`./img/module-4/win-primary-images/ice.png`, this.ice.imageObject),
          preloadImage(`./img/module-4/win-primary-images/airplane.png`, this.airplane.imageObject),
          preloadImage(`./img/module-4/win-primary-images/snowflake.png`, this.snowflake),
        ],
    );
  }

  /**
   * Отрисовка сцены
   */
  drawScene() {
    this.clear();

    this.drawCloud();
    this.drawTree();
    this.drawSeaCalfOnIce();
    this.drawSnowflakes();
    this.drawAirplane();
  }

  /**
   * Отрисовка котика на льдине
   */
  drawSeaCalfOnIce() {
    const {ctx, seaCalf, ice, wFactor, hFactor} = this;
    ctx.globalAlpha = 1;

    ctx.save();
    this.rotateCtx(ice.angle, ice.posX + 204 * wFactor, ice.posY + 84 * hFactor);
    ctx.drawImage(ice.imageObject, ice.posX, ice.posY, ice.width, ice.height);

    this.rotateCtx(seaCalf.angle, seaCalf.posX + 230 * wFactor, seaCalf.posY + 307 * hFactor);
    ctx.drawImage(seaCalf.imageObject, seaCalf.posX, seaCalf.posY, seaCalf.width, seaCalf.height);
    ctx.restore();
  }

  /**
   * Отрписовка снежинок
   */
  drawSnowflakes() {
    const {
      ctx,
      snowflakeFirst,
      snowflakeSecondary
    } = this;

    const drawSnowflake = (snowflake) => {
      const {
        imageObject,
        width,
        height,
        posX,
        angle,
        posY,
        opacity
      } = snowflake;

      ctx.save();
      ctx.globalAlpha = opacity;
      this.rotateCtx(angle, posX + width * 0.5, posY + height * 0.5);
      ctx.drawImage(imageObject, posX, posY, width, height);
      ctx.restore();
    };

    drawSnowflake(snowflakeFirst);
    drawSnowflake(snowflakeSecondary);
  }

  /**
   * Отрисовка елок
   */
  drawTree() {
    const {
      tree,
      tree2,
      ctx,
    } = this;

    const drawTree = (treeObject) => {
      const {
        imageObject,
        width,
        height,
        opacity,
        posX,
        posY,
      } = treeObject;

      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.drawImage(imageObject, posX, posY, width, height);
      ctx.restore();
    };

    drawTree(tree);
    drawTree(tree2);
  }

  /**
   * Отрисовка самолета
   */
  drawAirplane() {
    const {
      airplane,
      ctx,
    } = this;

    const {
      opacity,
      posX,
      posY,
      angle,
      width,
      height,
      imageObject
    } = airplane;

    ctx.save();
    ctx.globalAlpha = opacity;
    this.rotateCtx(angle, posX + width * 0.5, posY + height * 0.5);

    // нужно сдвинуть
    ctx.drawImage(
        imageObject,
        posX + width * (33 / 133),
        posY - height * (33 / 133),
        width,
        height,
    );
    ctx.restore();

    ctx.save();
  }

  /**
   * Отрисовка следа самолета
   */
  drawCloud() {
    const {ctx} = this;
    const {
      cloudCircleCenterX,
      cloudCircleCenterY,
      cloudCircleRadius,
      cloudOpacity
    } = this;
    const {
      curveX1, curveY1, curveX2, curveY2, // 771, 264, 952, 454
      curveX3, curveY3, curveX4, curveY4, // 980, 578, 754, 611
      cloudTopPointX, cloudTopPointY,
      cloudRightPointX, cloudRightPointY,
      cloudBottomPointX, cloudBottomPointY,
    }
      = this;

    ctx.save();
    ctx.globalAlpha = cloudOpacity;
    ctx.fillStyle = `#acc3ff`;
    ctx.beginPath();
    ctx.moveTo(cloudTopPointX, cloudTopPointY);
    ctx.bezierCurveTo(curveX1, curveY1, curveX2, curveY2, cloudRightPointX, cloudRightPointY);
    ctx.bezierCurveTo(curveX3, curveY3, curveX4, curveY4, cloudBottomPointX, cloudBottomPointY);

    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cloudCircleCenterX, cloudCircleCenterY, cloudCircleRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.restore();

  }

  /**
   * Запуск бесконечной анимации
   */
  startAnimationInfinite() {
    const globalAnimationTick = () => {
      this.drawScene();
    };

    const animations = [
      () => animateDuration(globalAnimationTick, 10000, 60),
    ];

    runSerial(animations).then(this.startAnimationInfinite.bind(this));
  }

  /**
   * Инициализация и старт анимации облаков
   */
  animateCloud() {
    const {wFactor, hFactor} = this;

    const symmetricalEase = bezierEasing(0, 0.0, 1, 1);

    /**
     * Формируем вспомогательную функция для генерации координат
     * @type {function(*=): {x: number, y: number}}
     */
    const path = moveByBezier([
      735 * wFactor, 305 * hFactor,
      830 * wFactor, 325 * hFactor,
      950 * wFactor, 455 * hFactor,
      1090 * wFactor, 385 * hFactor,
    ]);

    this.cloudCircleCenterX = cloud.circle.x * wFactor;
    this.cloudCircleCenterY = cloud.circle.y * hFactor;

    const cloudCircleRadiusTick = (from, to) => (progress) => {
      this.cloudCircleRadius = from + progress * (to - from);
      this.cloudCircleCenterY = (cloud.circle.y * hFactor + this.cloudCircleRadius - to);
    };

    const lineAnimationTick = (
        y3From,
        y3to,
    ) => (progress) => {
      const {x, y} = path(progress);
      this.cloudRightPointX = x;
      this.cloudRightPointY = y;
      this.cloudBottomPointY = y3From + progress * (y3to - y3From);
      this.curveX1 = (673 + progress * (771 - 673)) * wFactor;
      this.curveY1 = (280 + progress * (264 - 280)) * hFactor;
      this.curveX2 = (673 + progress * (952 - 673)) * wFactor;
      this.curveY2 = (280 + progress * (454 - 280)) * hFactor;

      this.curveX3 = (673 + progress * (980 - 673)) * wFactor;
      this.curveY3 = (280 + progress * (578 - 280)) * hFactor;
      this.curveX4 = (673 + progress * (754 - 673)) * wFactor;
      this.curveY4 = (280 + progress * (611 - 280)) * hFactor;
    };

    const opacityCloudTick = (from, to) => (progress) => {
      this.cloudOpacity = from + progress * (to - from);
    };

    this.curveX1 = 673 * wFactor;
    this.curveY1 = 280 * hFactor;
    this.curveX2 = 673 * wFactor;
    this.curveY2 = 280 * hFactor;
    this.curveX3 = 673 * wFactor;
    this.curveY3 = 280 * hFactor;
    this.curveX4 = 673 * wFactor;
    this.curveY4 = 280 * hFactor;

    this.cloudTopPointX = 665 * wFactor;
    this.cloudTopPointY = 280 * hFactor;
    this.cloudRightPointX = 665 * wFactor;
    this.cloudRightPointY = 280 * hFactor;
    this.cloudBottomPointX = 665 * wFactor;
    this.cloudBottomPointY = 280 * hFactor;

    const period = 0.8 * 1000;

    animateEasing(cloudCircleRadiusTick(0, 160 * hFactor), period, symmetricalEase);
    animateEasing(lineAnimationTick(280 * hFactor, 600 * hFactor), period, symmetricalEase);
    animateEasing(opacityCloudTick(0, 1), period * 0.2, symmetricalEase);
  }

  /**
   * Инициализация и старт анимации деревьев
   */
  animateTree() {
    const {tree, wFactor} = this;

    const symmetricalEase = bezierEasing(0.42, 0.0, 0.58, 1.0);

    const animatePositionTick = (fromPosY, toPosY, fromOpacity, toOpacity) => (progress) => {
      this.tree.posY = fromPosY + progress * (toPosY - fromPosY);
      this.tree.opacity = this.tree2.opacity = fromOpacity + progress * (toOpacity - fromOpacity);
    };

    const deltaY = 50 * wFactor;

    animateEasing(animatePositionTick(tree.posY + deltaY, tree.posY, 0, 1), 550, symmetricalEase);
  }

  /**
   * Инициализация и старт анимации самолета
   */
  animationAirplane() {
    const {wFactor, hFactor} = this;

    // path M735 302C830 325 950 455 1090 385
    const path = moveByBezier([
      735 * wFactor, 305 * hFactor,
      830 * wFactor, 325 * hFactor,
      950 * wFactor, 455 * hFactor,
      1090 * wFactor, 385 * hFactor,
    ]);

    const symmetricalEase = bezierEasing(0, 0.0, 1, 1);

    const period = 0.8 * 1000;

    const airplaneMoveTick = () => (progress) => {
      const {x, y} = path(progress);

      this.airplane.posX = x - this.airplane.width / 2;
      this.airplane.posY = y - this.airplane.height / 2;
    };

    const airplaneAngleTick = (angleFrom, angleTo) => (progress) => {
      this.airplane.angle = angleFrom + progress * (angleTo - angleFrom);
    };

    const airplaneOpacityTick = (angleFrom, angleTo) => (progress) => {
      this.airplane.opacity = angleFrom + progress * (angleTo - angleFrom);
    };

    animateEasing(airplaneMoveTick(), period, symmetricalEase);
    animateEasing(airplaneOpacityTick(0, 1), period * 0.25, symmetricalEase);
    runSerial([
      () => animateEasing(airplaneAngleTick(66, 50), period * 0.65, symmetricalEase),
      () => animateEasing(airplaneAngleTick(50, 9), period * 0.35, symmetricalEase),
    ]);
  }

  /**
   * Инициализация и старт анимации снежинок
   */
  animateSnowflake() {
    const {wFactor, hFactor} = this;
    const snowflakePosition = {
      x: 403 * wFactor,
      y: 330 * hFactor,
      yDelta: 30,
    };

    const snowflake2Position = {
      x: 835 * wFactor,
      y: 414 * hFactor,
      yDelta: 20,
    };

    this.snowflakeFirst.posX = snowflakePosition.x;
    this.snowflakeFirst.posY = snowflakePosition.y;
    this.snowflakeSecondary.posX = snowflake2Position.x;
    this.snowflakeSecondary.posY = snowflake2Position.y + snowflake2Position.yDelta;

    const period = 4000;

    const symmetricalEase = bezierEasing(0.42, 0.0, 0.58, 1.0);

    const snowFlakeOpacityTick = (from, to) => (progress) => {
      this.snowflakeFirst.opacity = from + progress * (to - from);
    };

    const snowFlake2OpacityTick = (from, to) => (progress) => {
      this.snowflakeSecondary.opacity = from + progress * (to - from);
    };

    const snowflakePositionTick = (from, to) => (progress) => {
      this.snowflakeFirst.posY = from + progress * (to - from);
    };

    const snowflake2PositionTick = (from, to) => (progress) => {
      this.snowflakeSecondary.posY = from + progress * (to - from);
    };

    const snowflakeAnimations = [
      () => animateEasing(
          snowflakePositionTick(snowflakePosition.y, snowflakePosition.y + snowflakePosition.yDelta),
          period * 0.5,
          symmetricalEase,
      ),
      () => animateEasing(
          snowflakePositionTick(snowflakePosition.y + snowflakePosition.yDelta, snowflakePosition.y),
          period * 0.5,
          symmetricalEase,
      ),
    ];

    const snowflake2Animations = [
      () => animateEasing(
          snowflake2PositionTick(snowflake2Position.y + snowflake2Position.yDelta, snowflake2Position.y),
          period * 0.5,
          symmetricalEase,
      ),
      () => animateEasing(
          snowflake2PositionTick(snowflake2Position.y, snowflake2Position.y + snowflake2Position.yDelta),
          period * 0.5,
          symmetricalEase,
      ),
    ];

    animateEasing(snowFlakeOpacityTick(0, 1), 650, symmetricalEase).then(
        () => {
          runSerialLoop(snowflakeAnimations);
        },
    );

    animateEasing(snowFlake2OpacityTick(0, 1), 1000, symmetricalEase).then(
        () => {
          runSerialLoop(snowflake2Animations);
        },
    );
  }

  /**
   * Инициализация и старт анимации котика на льдине
   */
  animateSeaCalf() {
    const showAnimationSeaCalfTick = (fromY, toY, fromAngle, toAngle) => (progress) => {
      this.seaCalf.posY = fromY + progress * (toY - fromY);
      this.seaCalf.angle = fromAngle + progress * (toAngle - fromAngle);
    };

    const showAnimationIceTick = (fromY, toY, fromAngle, toAngle) => (progress) => {
      this.ice.posY = fromY + progress * (toY - fromY);
      this.ice.angle = fromAngle + progress * (toAngle - fromAngle);
    };

    const moveSeaCalfFrom = 637 * this.wFactor;
    const moveSeaCalTo = 232 * this.wFactor;
    const moveIceFrom = 860 * this.wFactor;
    const moveIceTo = 456 * this.wFactor;
    const period = 1600;
    const yDelta = 20;

    const symmetricalEase = bezierEasing(0.42, 0.0, 0.58, 1.0);

    const YAnimationSeaCalf = [
      () => animateEasing(showAnimationSeaCalfTick(moveSeaCalfFrom, moveSeaCalTo - 20, 10, 10), period * 0.2, symmetricalEase),
      () => animateEasing(showAnimationSeaCalfTick(moveSeaCalTo - 20, moveSeaCalTo + yDelta, 10, -5), period * 0.25, symmetricalEase),
      () => animateEasing(showAnimationSeaCalfTick(moveSeaCalTo + yDelta, moveSeaCalTo, -5, 3), period * 0.2, symmetricalEase),
      () => animateEasing(showAnimationSeaCalfTick(moveSeaCalTo, moveSeaCalTo + yDelta * 0.5, 3, -2), period * 0.2, symmetricalEase),
      () => animateEasing(showAnimationSeaCalfTick(moveSeaCalTo + yDelta * 0.5, moveSeaCalTo, -2, 0), period * 0.2, symmetricalEase),
    ];

    const YAnimationIce = [
      () => animateEasing(showAnimationIceTick(moveIceFrom, moveIceTo - 20, 10, 10), period * 0.2, symmetricalEase),
      () => animateEasing(showAnimationIceTick(moveIceTo - 20, moveIceTo + yDelta, 10, -5), period * 0.25, symmetricalEase),
      () => animateEasing(showAnimationIceTick(moveIceTo + yDelta, moveIceTo, -5, 3), period * 0.2, symmetricalEase),
      () => animateEasing(showAnimationIceTick(moveIceTo, moveIceTo + yDelta * 0.5, 3, -2), period * 0.2, symmetricalEase),
      () => animateEasing(showAnimationIceTick(moveIceTo + yDelta * 0.5, moveIceTo, -2, 0), period * 0.2, symmetricalEase),
    ];

    runSerial(YAnimationIce);
    runSerial(YAnimationSeaCalf);
  }

  /**
   * Обновление размеров котика и льдины
   */
  updateSeaCalfAndIceSizing() {
    const {wFactor, hFactor, seaCalf, ice} = this;

    const seaClafWidth = WIN_SCENE_PARAMS.seaCalfWidth * wFactor;
    const seaClafHeight = seaClafWidth * seaCalf.aspectRatio;

    seaCalf.setDimensions(seaClafWidth, seaClafHeight);
    this.seaCalf.posX = 464 * wFactor;
    this.seaCalf.posY = 637 * hFactor;

    const iceWidth = WIN_SCENE_PARAMS.iceWidth * wFactor;
    const iceHeight = iceWidth * ice.aspectRatio;

    ice.setDimensions(iceWidth, iceHeight);
    this.ice.posX = 516 * wFactor;
    this.ice.posY = 860 * hFactor;
  }

  /**
   * Обновление размеров снежинок
   */
  updateSnowflakesSizing() {
    const {wFactor, snowflakeFirst, snowflakeSecondary} = this;

    const widthFirst = WIN_SCENE_PARAMS.snowflakeWidth * wFactor;
    const heightFirst = widthFirst * snowflakeFirst.aspectRatio;
    this.snowflakeFirst.setDimensions(widthFirst, heightFirst);

    const widthSecond = WIN_SCENE_PARAMS.snowflake2Width * wFactor;
    const heightSecond = widthSecond * snowflakeSecondary.aspectRatio;
    this.snowflakeSecondary.setDimensions(widthSecond, heightSecond);
  }

  /**
   * Обновление размеров самолета
   */
  updateAirplaneSizing() {
    const {wFactor, airplane} = this;

    const width = WIN_SCENE_PARAMS.airplaneWidth * wFactor;
    const height = width * airplane.imageObject.height / airplane.imageObject.width;

    this.airplane.setDimensions(width, height);
  }

  /**
   * Обновление размеров елок
   */
  updateTreeSizing() {
    const {wFactor, tree, tree2} = this;

    const treeWidth = WIN_SCENE_PARAMS.treeWidth * wFactor;
    const treeHeight = treeWidth * tree.aspectRatio;

    tree.setDimensions(treeWidth, treeHeight);
    tree.posX = 802 * wFactor;
    tree.posY = 364 * wFactor;

    const tree2Width = WIN_SCENE_PARAMS.tree2Width * wFactor;
    const tree2Height = tree2Width * tree2.aspectRatio;

    tree2.setDimensions(tree2Width, tree2Height);
    tree2.posX = 840 * wFactor;
    tree2.posY = 422 * wFactor;
  }

  /**
   * Основной цикл анимации сцены, отслеживает запуск по сценарию
   *
   * @param globalProgress
   */
  globalAnimationTick(globalProgress) {
    const seaCalfAnimationDelay = 0;
    const snowflakeAnimationDelay = 600;
    const treeAnimationDelay = 750;

    if (globalProgress >= seaCalfAnimationDelay && !this.runAnimations.includes(seaCalfAnimationDelay)) {
      this.runAnimations.push(seaCalfAnimationDelay);
      this.animateSeaCalf();
      this.startAnimationInfinite();
    }

    if (globalProgress >= treeAnimationDelay && !this.runAnimations.includes(treeAnimationDelay)) {
      this.runAnimations.push(treeAnimationDelay);
      this.animateTree();
    }

    if (globalProgress >= snowflakeAnimationDelay && !this.runAnimations.includes(snowflakeAnimationDelay)) {
      this.runAnimations.push(snowflakeAnimationDelay);
      this.animateSnowflake();
      this.animateCloud();
      this.animationAirplane();
    }
  }
}

const runWinScene = () => {
  const sceneOptions = {
    el: `#result .result__image`,
    duration: 10000,
  };

  new WinScene(sceneOptions).startAnimation().then(() => {
  });
};

export default runWinScene;
