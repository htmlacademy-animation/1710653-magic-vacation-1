import {CanvasScene} from "./CanvasScene";
import {CanvasSceneObject} from "./canvasSceneObject";
import {preloadImage} from "../../helpers/preloadImage";
import {animateDuration, animateEasing, delay, runSerial} from "../../helpers/animate";

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

    this.drawScene = this.drawScene.bind(this);

    this.prepareScene();
  }

  async prepareScene() {
    await this.loadImages();

    this.updateObjects();

    this.drawScene();
  }

  loadImages() {
    return Promise.all([
      preloadImage(`./img/module-4/lose-images/flamingo.png`, this.flamingo.imageObject),
      preloadImage(`./img/module-4/lose-images/watermelon.png`, this.watermelon.imageObject),
      preloadImage(`./img/module-4/lose-images/saturn.png`, this.planet.imageObject),
      preloadImage(`./img/module-4/lose-images/snowflake.png`, this.snowflake.imageObject),
      preloadImage(`./img/module-4/lose-images/leaf.png`, this.leaf.imageObject),
    ]);
  }

  drawScene() {
    this.clear();

    this.drawObjects();
  }

  drawObjects() {
    const {
      ctx,
      flamingo,
      watermelon,
      planet,
      snowflake,
      leaf,
      wFactor
    } = this;

    [
      flamingo,
      watermelon,
      planet,
      snowflake,
      leaf,
    ].map(({imageObject, angle, posX, posY, width, height}) => {
      ctx.save();
      this.rotateCtx(angle, posX + width / 2 * wFactor, posY + height / 2 * wFactor);

      ctx.drawImage(imageObject, posX, posY, width, height);
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
        fromWidth,
        toWidth,
        froHeight,
        toHeight,
        fromAngle = 0,
        toAngle = 0
    ) => (progress) => {
      object.posX = fromX + progress * (toX - fromX);
      object.posY = fromY + progress * (toY - fromY);
      object.width = fromWidth + progress * (toWidth - fromWidth);
      object.height = froHeight + progress * (toHeight - froHeight);
      object.angle = fromAngle + progress * (toAngle - fromAngle);

    };

    const timingShowFunction = (x) => {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
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
                centerXScene,
                obj.posX * wFactor,
                centerYScene,
                obj.posY * wFactor,
                sceneObject.width * 0.2,
                sceneObject.width,
                sceneObject.height * 0.2,
                sceneObject.height,
                obj.angleFrom,
                0
            ),
            1200,
            timingShowFunction,
        ),
        () => delay(100),
        () => animateEasing(
            animationTick(
                sceneObject,
                obj.posX * wFactor,
                obj.posX * wFactor,
                obj.posY * wFactor,
                this.vh + sceneObject.height * 1.1,
                sceneObject.width,
                sceneObject.width,
                sceneObject.height,
                sceneObject.height,
            ),
            1000,
            timingHideFunction,
        ),
      ]);
    }
  }

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

  globalAnimationTick(globalProgress) {
    const fallenObjectStartDelay = 500;

    if (globalProgress >= fallenObjectStartDelay && !this.runAnimations.includes(`AnimationFallenObjects`)) {
      this.runAnimations.push(`AnimationFallenObjects`);
      this.startAnimationFallenObjects();
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
