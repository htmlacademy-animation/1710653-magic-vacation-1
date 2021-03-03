import {CanvasScene} from "./CanvasScene";
import {CanvasSceneObject} from "./canvasSceneObject";
import {preloadImage} from "../../helpers/preloadImage";
import {animateDuration, animateEasing, delay, runSerial, runSerialLoop} from "../../helpers/animate";

/**
 * Базовые настройки сцены с размерами и позициями элементов
 */
const LoseSceneSettings = {
  fallenObjects: {
    flamingo: {
      w: 155,
      h: 155,
      posX: 436,
      posY: 296,
      angleFrom: 45
    },
    watermelon: {
      w: 135,
      h: 135,
      posX: 238,
      posY: 466,
      angleFrom: 45
    },
    planet: {
      w: 135,
      h: 135,
      posX: 987,
      posY: 541,
      angleFrom: -45
    },
    snowflake: {
      w: 120,
      h: 120,
      posX: 846,
      posY: 398,
      angleFrom: -45
    },
    leaf: {
      w: 180,
      h: 180,
      posX: 976,
      posY: 224,
      angleFrom: -45
    },
  },
  key: {
    w: 170,
    h: 290,
    posX: 635,
    posY: 290
  },
  crocodile: {
    w: 772,
    h: 772,
    posX: 330,
    posY: 100,
    fromPosX: 655,
    fromPosY: -30
  },
  tears: {
    w: 40,
    h: 60,
    posX: 672,
    posY: 512
  }
};


/**
 * Сцена проигрыша в конкурсе
 */
export class FailedScene extends CanvasScene {
  constructor(options) {
    super(options);

    this.flamingo = new CanvasSceneObject(new Image(), this.vw, 0, 0, 0);
    this.watermelon = new CanvasSceneObject(new Image(), this.vw, 0, 0, 0);
    this.planet = new CanvasSceneObject(new Image(), this.vw, 0, 0, 0);
    this.snowflake = new CanvasSceneObject(new Image(), this.vw, 0, 0, 0);
    this.leaf = new CanvasSceneObject(new Image(), this.vw, 0, 0, 0);
    this.crocodile = new CanvasSceneObject(new Image(), this.vw, 0, 0, 0);
    this.key = new CanvasSceneObject(new Image(), 635 * this.wFactor, 290 * this.wFactor, 0, 0);
    this.tears = new CanvasSceneObject(new Image(), 672 * this.wFactor, 290 * this.wFactor, 0, 0);

    this.drawScene = this.drawScene.bind(this);

    this.prepareScene();
  }

  /**
   * Подготовка сцены
   * @return {Promise<void>}
   */
  async prepareScene() {
    await this.loadImages();

    this.updateObjects();
    this.updateCrocodile();
    this.updateKey();

    this.drawScene();
  }

  /**
   * Предварительная загрузка всех необходимыйх изображений
   * @return {Promise<Event[]>}
   */
  loadImages() {
    return Promise.all([
      preloadImage(`./img/module-4/lose-images/flamingo.png`, this.flamingo.imageObject),
      preloadImage(`./img/module-4/lose-images/watermelon.png`, this.watermelon.imageObject),
      preloadImage(`./img/module-4/lose-images/saturn.png`, this.planet.imageObject),
      preloadImage(`./img/module-4/lose-images/snowflake.png`, this.snowflake.imageObject),
      preloadImage(`./img/module-4/lose-images/leaf.png`, this.leaf.imageObject),
      preloadImage(`./img/module-4/lose-images/crocodile.png`, this.crocodile.imageObject),
      preloadImage(`./img/module-4/lose-images/key.png`, this.key.imageObject),
      preloadImage(`./img/module-4/lose-images/drop.png`, this.tears.imageObject),
    ]);
  }

  /**
   * Отрисовка всей сцены с учетом z слоев
   */
  drawScene() {
    this.clear();
    this.drawKey();
    this.drawObjects();
    this.drawCrocodile();
    this.drawTears();
  }

  /**
   * Рисуем замочную скважину
   */
  drawKey() {
    const {
      ctx,
      key,
    } = this;

    const {
      imageObject,
      posX,
      posY,
      width,
      height,
      opacity,
      scale
    } = key;

    const x = posX + (width - width * scale) / 2;
    const y = posY + (height - height * scale) / 2;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.drawImage(imageObject, x, y, width * scale, height * scale);
    ctx.restore();
  }

  /**
   * Рисуем крокодила
   */
  drawCrocodile() {
    const {
      ctx,
      wFactor,
      crocodile,
      vh
    } = this;

    const {
      imageObject,
      posX,
      posY,
      width,
      height
    } = crocodile;

    ctx.save();


    // рисуем обрезающую фигуру
    // M804 760V578.5L774 435.5C791.469 419.829 804 398.15 804 372.5C804 325.28 766.616 287 720.5 287V-0.5
    ctx.beginPath();
    ctx.moveTo(0, vh);
    ctx.lineTo(805 * wFactor, 760 * wFactor);
    ctx.lineTo(805 * wFactor, 578 * wFactor);
    ctx.lineTo(774 * wFactor, 435 * wFactor);
    ctx.arc((636 + 168 / 2) * wFactor, (287 + 168 / 2) * wFactor, 168 / 2 * wFactor, 50 * Math.PI / 180, -90 * Math.PI / 180, true);
    ctx.lineTo(720 * wFactor, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(imageObject, posX, posY, width, height);
    ctx.restore();
  }

  /**
   * Отрисовка слез крокодила
   */
  drawTears() {
    const {
      ctx,
      tears,
    } = this;

    const {
      imageObject,
      posX,
      posY,
      width,
      height,
      opacity,
      scale
    } = tears;

    ctx.save();
    ctx.globalAlpha = opacity;

    const x = posX + (width - width * scale) / 2;
    // const y = posY - (height - height * scale) / 2;

    ctx.drawImage(imageObject, x, posY, width * scale, height * scale);
    ctx.restore();
  }

  /**
   * Отрисовка падающих объектов
   */
  drawObjects() {
    const {
      ctx,
      flamingo,
      watermelon,
      planet,
      snowflake,
      leaf,
    } = this;

    [
      flamingo,
      watermelon,
      planet,
      snowflake,
      leaf,
    ].map(({imageObject, angle, posX, posY, width, height, scale}) => {
      ctx.save();

      const x = posX + (width - width * scale) / 2;
      const y = posY + (height - height * scale) / 2;
      const realWidth = width * scale;
      const realHeight = height * scale;

      this.rotateCtx(angle, x + realWidth / 2, y + realHeight / 2);

      ctx.drawImage(imageObject, x, y, realWidth, realHeight);
      ctx.restore();
    });
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
   * Запуск анимации крокодила
   */
  startAnimationCrocodileObjects() {
    const {
      wFactor,
    } = this;

    const timingShowFunction = (x) => {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    };

    const animationTick = (fromPoint, toPoint) => (progress) => {
      this.crocodile.posX = fromPoint.x + progress * (toPoint.x - fromPoint.x);
      this.crocodile.posY = fromPoint.y + progress * (toPoint.y - fromPoint.y);
    };

    const {crocodile} = LoseSceneSettings;

    animateEasing(
        animationTick(
            {
              x: crocodile.fromPosX * wFactor,
              y: crocodile.fromPosY * wFactor
            },
            {
              x: crocodile.posX * wFactor,
              y: crocodile.posY * wFactor
            }
        ),
        1000,
        timingShowFunction,
    );
  }

  /**
   * ЗАпуск анимации появления замочной скважины
   */
  startAnimationKey() {
    const timingShowFunction = (x) => {
      return x;
    };

    const animationTick = (
        opacityFrom = undefined,
        opacityTo = undefined,
        scaleFrom = undefined,
        scaleTo = undefined
    ) => (progress) => {
      if (scaleFrom !== undefined && scaleTo !== undefined) {
        this.key.scale = scaleFrom + progress * (scaleTo - scaleFrom);
      }
      if (opacityFrom !== undefined && opacityTo !== undefined) {
        this.key.opacity = opacityFrom + progress * (opacityTo - opacityFrom);
      }
    };

    animateEasing(
        animationTick(0, 1, 0.7, 1),
        350,
        timingShowFunction
    );
  }

  /**
   * Запуск анимации плачущего крокодила :(
   */
  startAnimationTears() {
    const {
      wFactor,
    } = this;

    const timingShowFunction = (x) => {
      return x;
    };

    const animationTick = (
        fromY,
        toY,
        opacityFrom = undefined,
        opacityTo = undefined,
        scaleFrom = undefined,
        scaleTo = undefined
    ) => (progress) => {
      this.tears.posY = fromY + progress * (toY - fromY);

      if (scaleFrom !== undefined && scaleTo !== undefined) {
        this.tears.scale = scaleFrom + progress * (scaleTo - scaleFrom);
      }
      if (opacityFrom !== undefined && opacityTo !== undefined) {
        this.tears.opacity = opacityFrom + progress * (opacityTo - opacityFrom);
      }
    };

    const {tears} = LoseSceneSettings;
    const delta = 50 * wFactor;

    const period = 1000;

    runSerialLoop([
      () => animateEasing(
          animationTick(tears.posY * wFactor, tears.posY * wFactor, 1, 1, 0, 1),
          period * 0.25,
          timingShowFunction
      ),
      () => delay(100),
      () => animateEasing(
          animationTick(tears.posY * wFactor, tears.posY * wFactor + delta * 0.7),
          period * 0.5,
          timingShowFunction
      ),
      () => animateEasing(
          animationTick(
              tears.posY * wFactor + delta * 0.7,
              tears.posY * wFactor + delta,
              1,
              0, 1,
              0.7
          ),
          period * 0.25,
          timingShowFunction
      ),
      () => delay(1000)
    ]);
  }

  /**
   * Запуск анимации падающих объектов
   */
  startAnimationFallenObjects() {
    const {
      wFactor,
    } = this;

    const animationTick = (
        object,
        fromX,
        toX,
        fromY,
        toY,
        scaleFrom = undefined,
        scaleTo = undefined,

        fromAngle = 0,
        toAngle = 0
    ) => (progress) => {
      object.posX = fromX + progress * (toX - fromX);
      object.posY = fromY + progress * (toY - fromY);
      object.angle = fromAngle + progress * (toAngle - fromAngle);

      if (scaleFrom !== undefined && scaleTo !== undefined) {
        object.scale = scaleFrom + progress * (scaleTo - scaleFrom);
      }
    };

    const timingShowFunction = (x) => {
      return 1 - (1 - x) * (1 - x);
    };

    const timingHideFunction = (x) => x ** 5;

    const centerXScene = this.vw / 2;
    const centerYScene = this.vh / 2;

    const {fallenObjects} = LoseSceneSettings;

    // eslint-disable-next-line guard-for-in
    for (const key in fallenObjects) {
      const obj = LoseSceneSettings.fallenObjects[key];
      const sceneObject = this[key];

      runSerial([
        () => animateEasing(
            animationTick(
                sceneObject,
                centerXScene - sceneObject.width / 2,
                obj.posX * wFactor,
                centerYScene - sceneObject.height / 2,
                obj.posY * wFactor,
                0,
                1,
                obj.angleFrom,
                0
            ),
            800,
            timingShowFunction,
        ),
        () => delay(200),
        () => animateEasing(
            animationTick(
                sceneObject,
                obj.posX * wFactor,
                obj.posX * wFactor,
                obj.posY * wFactor,
                this.vh + sceneObject.height * 1.1,
            ),
            600,
            timingHideFunction,
        ),
      ]);
    }
  }

  /**
   * Обновление размеров объектов
   */
  updateObjects() {
    const {wFactor} = this;
    // eslint-disable-next-line guard-for-in
    for (const key in LoseSceneSettings.fallenObjects) {
      const obj = LoseSceneSettings.fallenObjects[key];

      const w = obj.w * wFactor;
      const h = w * this[key].aspectRatio;

      this[key].setDimensions(w, h);
    }
  }

  /**
   * Обновление размеров крокодила
   */
  updateCrocodile() {
    const {wFactor} = this;
    // eslint-disable-next-line guard-for-in
    const w = LoseSceneSettings.crocodile.w * wFactor;
    const h = w * this.crocodile.aspectRatio;

    this.crocodile.setDimensions(w, h);

    const wT = LoseSceneSettings.tears.w * wFactor;
    const hT = wT * this.tears.aspectRatio;

    this.tears.setDimensions(wT, hT);
  }

  /**
   * Обновление размеров замочной скважины
   */
  updateKey() {
    const {wFactor} = this;
    // eslint-disable-next-line guard-for-in
    const w = LoseSceneSettings.key.w * wFactor;
    const h = w * this.key.aspectRatio;

    this.key.setDimensions(w, h);
  }

  /**
   * Глобальный цикл
   * @param {object} globalProgress
   */
  globalAnimationTick(globalProgress) {
    const fallenObjectStartDelay = 200;
    const crocodileStartDelay = 500;
    const crocodileTearsStartDelay = 1100;

    if (globalProgress >= fallenObjectStartDelay && !this.runAnimations.includes(`AnimationFallenObjects`)) {
      this.runAnimations.push(`AnimationFallenObjects`);
      this.startAnimationFallenObjects();
      this.startAnimationKey();
    }

    if (globalProgress >= crocodileStartDelay && !this.runAnimations.includes(`crocodileStartDelay`)) {
      this.runAnimations.push(`crocodileStartDelay`);
      this.startAnimationCrocodileObjects();
    }

    if (globalProgress >= crocodileTearsStartDelay && !this.runAnimations.includes(`crocodileTearsStartDelay`)) {
      this.runAnimations.push(`crocodileTearsStartDelay`);
      this.startAnimationTears();
    }
    this.startAnimationInfinite();
  }
}

const runFailedScene = () => {
  const sceneOptions = {
    el: `#result3 .result__image`,
    duration: 10000,
  };

  new FailedScene(sceneOptions).startAnimation().then(() => {
  });
};

export default runFailedScene;
