import * as THREE from "three/src/Three";
import {getHueShiftAndMagnifier} from "./shaders/hueShiftAndMagnifier/hueShiftAndMagnifier";
import {animateEasing, runSerial} from "../../helpers/animate";
import {getRandomInRange} from "../../helpers/RandomInRange";

/**
 * Контроллер переключения и запуска сцен
 */
export class BackgroundSceneController {
  /**
   * Конструктор
   * @param {container: Selector}container
   */
  constructor({
    container = ``,
  }) {
    const containerEl = document.querySelector(container);

    if (!containerEl) {
      throw new Error(`container is required prop`);
    }

    // формируем сцену
    this.scene = new THREE.Scene();

    // создаем камеру
    const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.z = 400;
    this.camera = camera;

    // Создаем рендерер с альфа каналом и задаем ему цвет очиски фона
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      logarithmicDepthBuffer: false,
      powerPreference: `high-performance`,
    });
    const color = new THREE.Color(0xEEEEEE);
    const alpha = 0.0;

    renderer.setClearColor(color, alpha);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.autoClear = false;
    this.renderer = renderer;

    this.updateCanvasSize();

    this.textureLoader = new THREE.TextureLoader();

    // Добавлеям в дом
    containerEl.appendChild(renderer.domElement);
  }

  /**
   * Инициализируем
   */
  async init() {
    await this.createScenes();
    this.addHandlers();

    // TODO: не очень хорошее решение, пока не придумал как лучше сделать
    if (window.location.hash === `#story`) {
      this.setVisibleScene(`SCENE_1`);
    } else {
      this.setVisibleScene(`SCENE_0`);
    }
    this.loop();
  }

  /**
   * Добавляем слушаетелей на изменение сцены или слайдов
   */
  addHandlers() {
    window.addEventListener(`resize`, this.updateCanvasSize.bind(this));

    document.body.addEventListener(`screenChanged`, ({detail}) => {
      switch (detail.screenName) {
        case `top`:
          this.setVisibleScene(`SCENE_0`);
          break;
        case `story`:
          this.setVisibleScene(`SCENE_1`);
          break;
      }
    });

    document.body.addEventListener(`slideChanged`, ({detail}) => {
      this.setVisibleScene(detail.scene);
    });
  }

  /**
   * Создание всех сцен
   * @return {Promise<void>}
   */
  async createScenes() {
    const {textureLoader} = this;

    // грузим текстуры
    const textures = await Promise.all([
      textureLoader.load(`./img/module-5/scenes-textures/scene-0.png`),
      textureLoader.load(`./img/module-5/scenes-textures/scene-1.png`),
      textureLoader.load(`./img/module-5/scenes-textures/scene-2.png`),
      textureLoader.load(`./img/module-5/scenes-textures/scene-3.png`),
      textureLoader.load(`./img/module-5/scenes-textures/scene-4.png`),
    ]);

    // Формируем коллекцию сцен
    this.scenes = textures.reduce((obj, texture, index) => {
      obj[`SCENE_${index}`] = index === 2 ? this.addUnderWaterScene(texture) : this.addScene(texture);
      return obj;
    }, {});
  }

  /**
   * Добавление сцены с нужной текстурой
   * @param {THREE.Texture} texture
   * @return {Mesh}
   */
  addScene(texture,) {

    const material = new THREE.MeshBasicMaterial({map: texture});
    const plane = getPlaneLayer(material, 1440, 760);

    // Скрываем вначале все сцены
    plane.visible = false;
    this.scene.add(plane);

    return plane;
  }

  addUnderWaterScene(texture,) {
    // const material = getHueShiftMaterial(texture, -5 * Math.PI / 180);
    // const material = geGrayScaleMaterial(texture, 0.5);
    const bubbles = [
      {
        center: new THREE.Vector2(300, 500),
        radius: 60,
      },
      {
        center: new THREE.Vector2(750, 200),
        radius: 80,
      },
      {
        center: new THREE.Vector2(800, 400),
        radius: 70,
      },
    ];

    const material = getHueShiftAndMagnifier(texture, 0, bubbles);

    const plane = getPlaneLayer(material, 1440, 760);

    // Скрываем вначале все сцены
    plane.visible = false;
    this.scene.add(plane);

    return plane;
  }

  runHueShiftAnimation() {
    if (!this.currentSceneId === `SCENE_2`) {
      return;
    }

    const timeFunction = (x) => {
      return 1 - (1 - x) ** 3;
    };

    const animateHueTick = (start, end) => (progress) => {
      this.scenes[`SCENE_2`].material.uniforms.shift.value = (start + progress * (end - start)) * Math.PI / 180;
    };

    const timeDuration = 1500;
    const firstTime = Math.floor(getRandomInRange(0.4, 0.7) * timeDuration);
    const secondTime = timeDuration - firstTime;

    const shiftValue = getRandomInRange(1, 4);

    runSerial([
      () => animateEasing(animateHueTick(0, shiftValue), firstTime, timeFunction),
      () => animateEasing(animateHueTick(shiftValue, 0), secondTime, timeFunction),
    ]).then(this.runHueShiftAnimation.bind(this));
  }

  /**
   * Обновляем размеры холста рендерера
   */
  updateCanvasSize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * переключаем сцену
   * @param id
   */
  setVisibleScene(id) {
    if (this.currentScene) {
      this.currentScene.visible = false;
    }

    if (!Object.prototype.hasOwnProperty.call(this.scenes, id)) {
      return;
    }

    this.currentSceneId = id;
    this.currentScene = this.scenes[id];

    switch (id) {
      case `SCENE_2`:
        this.runHueShiftAnimation();
        break;
    }

    this.currentScene.visible = true;
  }

  /**
   * Основной цикл рендера
   */
  loop() {
    const {renderer, scene, camera} = this;

    const startX = 500;
    const animate = (props) => {
      requestAnimationFrame(animate);

      renderer.render(scene, camera);
    };

    animate();
  }
}


let backgroundWebGlController;

/**
 * Фабрика контроллера
 * @return {BackgroundSceneController}
 */
const backgroundWebGlControllerFactory = async () => {
  if (!backgroundWebGlController) {
    backgroundWebGlController = await new BackgroundSceneController({
      container: `#background-canvas`,
    });

    await backgroundWebGlController.init();
  }

  return backgroundWebGlController;
};

const getPlaneLayer = (material, width, height) => {
  const geometry = new THREE.PlaneBufferGeometry(width, height);
  const plane = new THREE.Mesh(geometry, material);

  material.needsUpdate = true;

  return plane;
};

export default backgroundWebGlControllerFactory;
