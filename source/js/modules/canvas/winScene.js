/**
 * Базовый класс для работы со сценами вариантов завершения игры
 */
import {animateDuration, animateEasing, moveByBezier, runSerial, runSerialLoop} from "../../helpers/animate";
import {preloadImage} from "../../helpers/preloadImage";
import {bezierEasing} from "../../helpers/cubic-bezier";
import {CanvasScene} from "./CanvasScene";


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

    this.seaCalf = new Image();
    this.tree = new Image();
    this.tree2 = new Image();
    this.ice = new Image();
    this.airplane = new Image();
    this.snowflake = new Image();

    this.seaClafT = 231;
    this.seaClafL = 464;
    this.iceT = 455;
    this.iceL = 516;

    this.snowflakeT = 0;
    this.snowflakeL = 0;
    this.snowflakeWidth = 0;
    this.snowflakeHeight = 0;
    this.snowflakeAngle = -12.5;
    this.snowflakeOpacity = 0;

    this.snowflake2T = 0;
    this.snowflake2L = 0;
    this.snowflake2Width = 0;
    this.snowflake2Height = 0;
    this.snowflake2Angle = -175;
    this.snowflake2Opacity = 0;

    this.sealClafAndIceAngle = 20;
    this.iceAngle = 20;

    this.treePosX = 0;
    this.treePosY = 0;
    this.treeWidth = 0;
    this.treeHeight = 0;
    this.treeOpacity = 0;
    this.tree2PosX = 0;
    this.tree2PosY = 0;
    this.tree2Width = 0;
    this.tree2Height = 0;
    this.treeOpacity = 0;

    this.runAnimations = [];

    this.cloudCircleCenterX = 0;
    this.cloudCircleCenterY = 0;
    this.cloudCircleRadius = 0;

    this.airplanePosX = 0;
    this.airplanePosY = 0;
    this.airplaneAngle = 0;
    this.airplaneOpacity = 0;

    this.images = [
      this.seaCalf.addEventListener(`load`, () => {
      }),
      this.tree.addEventListener(`load`, () => {
      }),
      this.tree2.addEventListener(`load`, () => {
      }),
      this.ice.addEventListener(`load`, () => {
      }),
      this.airplane.addEventListener(`load`, () => {
      }),
      this.snowflake.addEventListener(`load`, () => {
      }),
    ];


    this.drawScene = this.drawScene.bind(this);
    this.prepareScene();
  }

  /**
   * Подготовка к отрписовке сцены
   * @returns {Promise<void>}
   */
  async prepareScene() {
    this.seaClafWidth = 0;
    this.seaClafHeight = 0;
    this.iceWidth = 0;
    this.iceHeight = 0;
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
        preloadImage(`/img/module-4/win-primary-images/sea-calf-2.png`, this.seaCalf),
        preloadImage(`/img/module-4/win-primary-images/tree.png`, this.tree),
        preloadImage(`/img/module-4/win-primary-images/tree 2.png`, this.tree2),
        preloadImage(`/img/module-4/win-primary-images/ice.png`, this.ice),
        preloadImage(`/img/module-4/win-primary-images/airplane.png`, this.airplane),
        preloadImage(`/img/module-4/win-primary-images/snowflake.png`, this.snowflake),
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
    const {ctx} = this;
    ctx.globalAlpha = 1;

    ctx.save();
    this.rotateCtx(this.iceAngle, this.iceL + 204, this.iceT + 84);
    ctx.drawImage(this.ice, this.iceL, this.iceT, this.iceWidth, this.iceHeight);
    ctx.restore();
    ctx.save();
    this.rotateCtx(this.sealClafAndIceAngle, this.seaClafL + 230, this.seaClafT + 307);
    ctx.drawImage(this.seaCalf, this.seaClafL, this.seaClafT, this.seaClafWidth, this.seaClafHeight);
    ctx.restore();
  }

  /**
   * Отрписовка снежинок
   */
  drawSnowflakes() {
    const {ctx} = this;
    const {
      snowflakeT,
      snowflakeL,
      snowflakeAngle,
      snowflake,
      snowflakeWidth,
      snowflakeHeight,
      snowflakeOpacity,
    } = this;
    const {
      snowflake2T,
      snowflake2L,
      snowflake2Angle,
      snowflake2Width,
      snowflake2Height,
      snowflake2Opacity,
    } = this;

    // первая снежинка
    ctx.save();
    ctx.globalAlpha = snowflakeOpacity;
    this.rotateCtx(snowflakeAngle, snowflakeL + snowflakeWidth * 0.5, snowflakeT + snowflakeHeight * 0.5);
    ctx.drawImage(snowflake, snowflakeL, snowflakeT, snowflakeWidth, snowflakeHeight);
    ctx.restore();


    // второая снежинка
    ctx.save();
    ctx.globalAlpha = snowflake2Opacity;
    this.rotateCtx(snowflake2Angle, snowflake2L + snowflake2Width * 0.5, snowflake2T + snowflake2Height * 0.5);
    ctx.drawImage(snowflake, snowflake2L, snowflake2T, snowflake2Width, snowflake2Height);
    ctx.restore();
  }

  /**
   * Отрисовка елок
   */
  drawTree() {
    const {
      tree,
      treePosX,
      treePosY,
      treeWidth,
      treeHeight,
      treeOpacity,
      tree2,
      tree2PosX,
      tree2PosY,
      tree2Width,
      tree2Height,
      ctx,
    } = this;

    ctx.save();
    ctx.globalAlpha = treeOpacity;
    ctx.drawImage(tree, treePosX, treePosY, treeWidth, treeHeight);
    ctx.drawImage(tree2, tree2PosX, tree2PosY, tree2Width, tree2Height);
    ctx.restore();
  }

  /**
   * Отрисовка самолета
   */
  drawAirplane() {
    const {
      airplane,
      airplaneWidth,
      airplaneHeight,
      airplanePosX,
      airplanePosY,
      airplaneAngle,
      airplaneOpacity,
      ctx,
    } = this;

    ctx.save();
    ctx.globalAlpha = airplaneOpacity;
    this.rotateCtx(airplaneAngle, airplanePosX + airplaneWidth * 0.5, airplanePosY + airplaneHeight * 0.5);

    // нужно сдвинуть
    ctx.drawImage(
        airplane,
        airplanePosX + airplaneWidth * (33 / 133),
        airplanePosY - airplaneHeight * (33 / 133),
        airplaneWidth,
        airplaneHeight,
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
    const {treePosY, hFactor} = this;

    const symmetricalEase = bezierEasing(0.42, 0.0, 0.58, 1.0);

    const animatePositionTick = (fromPosY, toPosY, fromOpacity, toOpacity) => (progress) => {
      this.treePosY = fromPosY + progress * (toPosY - fromPosY);
      this.treeOpacity = fromOpacity + progress * (toOpacity - fromOpacity);
    };

    const deltaY = 50 * hFactor;

    animateEasing(animatePositionTick(treePosY + deltaY, treePosY, 0, 1), 550, symmetricalEase);
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

      this.airplanePosX = x - this.airplaneWidth / 2;
      this.airplanePosY = y - this.airplaneHeight / 2;
    };

    const airplaneAngleTick = (angleFrom, angleTo) => (progress) => {
      this.airplaneAngle = angleFrom + progress * (angleTo - angleFrom);
    };

    const airplaneOpacityTick = (angleFrom, angleTo) => (progress) => {
      this.airplaneOpacity = angleFrom + progress * (angleTo - angleFrom);
    };

    animateEasing(airplaneMoveTick(), period, symmetricalEase);
    animateEasing(airplaneOpacityTick(0,1), period * 0.25, symmetricalEase);
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

    this.snowflakeL = snowflakePosition.x;
    this.snowflakeT = snowflakePosition.y;
    this.snowflake2L = snowflake2Position.x;
    this.snowflake2T = snowflake2Position.y + snowflake2Position.yDelta;

    const period = 4000;

    const symmetricalEase = bezierEasing(0.42, 0.0, 0.58, 1.0);

    const snowFlakeOpacityTick = (from, to) => (progress) => {
      this.snowflakeOpacity = from + progress * (to - from);
    };

    const snowFlake2OpacityTick = (from, to) => (progress) => {
      this.snowflake2Opacity = from + progress * (to - from);
    };

    const snowflakePositionTick = (from, to) => (progress) => {
      this.snowflakeT = from + progress * (to - from);
    };

    const snowflake2PositionTick = (from, to) => (progress) => {
      this.snowflake2T = from + progress * (to - from);
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
      this.seaClafT = fromY + progress * (toY - fromY);
      this.sealClafAndIceAngle = fromAngle + progress * (toAngle - fromAngle);
    };

    const showAnimationIceTick = (fromY, toY, fromAngle, toAngle) => (progress) => {
      this.iceT = fromY + progress * (toY - fromY);
      this.iceAngle = fromAngle + progress * (toAngle - fromAngle);
    };

    const moveSeaCalfFrom = 637 * this.hFactor;
    const moveSeaCalTo = 232 * this.hFactor;
    const moveIceFrom = 860 * this.hFactor;
    const moveIceTo = 456 * this.hFactor;
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
    const {wFactor, hFactor} = this;
    this.seaClafWidth = WIN_SCENE_PARAMS.seaCalfWidth * wFactor;
    this.seaClafHeight = this.seaClafWidth * this.seaCalf.height / this.seaCalf.width;

    this.iceWidth = WIN_SCENE_PARAMS.iceWidth * wFactor;
    this.iceHeight = this.iceWidth * this.ice.height / this.ice.width;

    this.seaClafT = 637 * hFactor;
    this.seaClafL = 464 * wFactor;
    this.iceT = 860 * hFactor;
    this.iceL = 516 * wFactor;
  }

  /**
   * Обновление размеров снежинок
   */
  updateSnowflakesSizing() {
    const {wFactor} = this;

    this.snowflakeWidth = WIN_SCENE_PARAMS.snowflakeWidth * wFactor;
    this.snowflakeHeight = this.snowflakeWidth * this.snowflake.height / this.snowflake.width;

    this.snowflake2Width = WIN_SCENE_PARAMS.snowflake2Width * wFactor;
    this.snowflake2Height = this.snowflake2Width * this.snowflake.height / this.snowflake.width;
  }

  /**
   * Обновление размеров самолета
   */
  updateAirplaneSizing() {
    const {wFactor, airplane} = this;

    this.airplaneWidth = WIN_SCENE_PARAMS.airplaneWidth * wFactor;
    this.airplaneHeight = this.airplaneWidth * airplane.height / airplane.width;
  }

  /**
   * Обновление размеров елок
   */
  updateTreeSizing() {
    const {wFactor, hFactor, tree, tree2} = this;

    this.treePosX = 802 * wFactor;
    this.treePosY = 364 * hFactor;
    this.treeWidth = WIN_SCENE_PARAMS.treeWidth * wFactor;
    this.treeHeight = this.treeWidth * tree.height / tree.width;
    this.tree2PosX = 840 * wFactor;
    this.tree2PosY = 422 * hFactor;
    this.tree2Width = WIN_SCENE_PARAMS.tree2Width * wFactor;
    this.tree2Height = this.tree2Width * tree2.height / tree2.width;
  }

  /**
   * Основной цикл анимации сцены, отслеживает запуск по сценарию
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
