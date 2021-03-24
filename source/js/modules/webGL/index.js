import * as THREE from "three/src/Three";
import {getHueShiftMaterial} from "./shaders/hueShift/hueShader";

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
      antialias: false,
      logarithmicDepthBuffer: false,
      powerPreference: `high-performance`
    });
    const color = new THREE.Color(0xEEEEEE);
    const alpha = 0.0;

    renderer.setClearColor(color, alpha);
    renderer.setPixelRatio(window.devicePixelRatio);
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
      obj[`SCENE_${index}`] = this.addScene(texture);
      return obj;
    }, {});
  }

  /**
   * Добавление сцены с нужной текстурой
   * @param {THREE.Texture} texture
   * @return {Mesh}
   */
  addScene(texture) {
    const material = getHueShiftMaterial(texture, -5 * Math.PI / 180);
    const plane = getPlaneLayer(material, 1440, 760);
    // TODO: Спросить почему не работает текстура при таком решении создании меша
    /* const mesh = new THREE.Mesh(geometryScene, material);
    mesh.position.set(-200, -100, 0);
    // mesh.rotateX(270);*/
    // Скрываем вначале все сцены
    plane.visible = false;
    this.scene.add(plane);

    return plane;
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

    this.currentScene = this.scenes[id];

    this.currentScene.visible = true;
  }

  /**
   * Основной цикл рендера
   */
  loop() {
    const {renderer, scene, camera} = this;

    const animate = () => {
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
