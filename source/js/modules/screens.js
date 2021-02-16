import AccentTypographyBuilder from "./AccentTypographyBuilder";
import {animateNumber} from "./numberAnimation";

class ScreenAnimationTimeline {
  constructor(id) {
    this._id = id;
    this.played = false;
    this.animations = [];
    this.oneAnimations = [];
  }

  _run() {
    this.played = true;

    for (const animationCallback of this.animations) {
      if (typeof animationCallback === `function`) {
        animationCallback();
      }
    }

    for (const animationCallback of this.oneAnimations) {
      if (typeof animationCallback === `function`) {
        animationCallback();
      }

      this.oneAnimations = [];
    }
  }

  addAnimation(callback, delay) {
    this.animations.push(() => setTimeout(() => callback(), delay));
  }

  addOneAnimation(callback, delay) {
    this.oneAnimations.push(() => setTimeout(() => callback(), delay));
  }

  run() {
    this._run();
  }
}

const Screens = {
  MAIN: `top`,
  STORY: `story`,
  PRIZES: `prizes`,
  RULES: `rules`,
  GAME: `game`,
};

export default () => {
  const screensAnimations = {};

  {
    const letterAnimationOrdering = [
      // Т, А, И, Н, С, Т, В, Е, Н, Н, Ы, Й
      [4, 2, 1, 2, 3, 2, 1, 5, 3, 1, 3, 1],
      // О, Т, П, У, С, К
      [7, 8, 6, 5, 7, 5],
    ];
    const dateTextAnimationOrdeing = [
      [3, 1],
      [2],
      [3, 1],
      [2],
      [3, 1, 3, 1],
    ];

    const mainScreen = new ScreenAnimationTimeline(Screens.MAIN);
    const mainHeading = new AccentTypographyBuilder(`.intro__title`, 650, `transform`, `active`, letterAnimationOrdering);
    const dateText = new AccentTypographyBuilder(`.intro__date`, 650, `transform`, `active`, dateTextAnimationOrdeing);

    mainScreen.addAnimation(() => {
      mainHeading.run();

    }, 600);

    mainScreen.addAnimation(() => {
      dateText.run();
    }, 1200);

    screensAnimations[Screens.MAIN] = mainScreen;
  }

  {
    const storyScreen = new ScreenAnimationTimeline(Screens.STORY);

    const pageHeading = new AccentTypographyBuilder(
      `.slider__item-title`,
      650, `transform`,
      `active`,
      [[3, 2, 1, 2, 3, 2, 1]],
    );

    storyScreen.addAnimation(() => {
      pageHeading.run();
    }, 500);

    screensAnimations[Screens.STORY] = storyScreen;
  }

  {
    const prizesScreen = new ScreenAnimationTimeline(Screens.PRIZES);

    const prizesNumbers = document.querySelectorAll(`.js-animate-number`);

    const pageHeading = new AccentTypographyBuilder(
      `.prizes__title`,
      650, `transform`,
      `active`,
      [[3, 2, 1, 2, 3]],
    );

    const svgAnimateImages = document.querySelectorAll(`[data-animate-svg-src]`);

    prizesScreen.addAnimation(() => {
      pageHeading.run();
    }, 500);

    prizesScreen.addOneAnimation(() => {
      prizesNumbers.forEach((el) => {
        const {from, to} = el.dataset;
        animateNumber(parseInt(from, 10), parseInt(to, 10), el, 900);
      });
    }, 500);

    prizesScreen.addOneAnimation(() => {
      svgAnimateImages.forEach((image) => {
        if (image.done) {
          return;
        }

        image.src = image.dataset.animateSvgSrc;
        image.done = true;
      });
    }, 0);

    screensAnimations[Screens.PRIZES] = prizesScreen;
  }

  {
    const rulesScreen = new ScreenAnimationTimeline(Screens.RULES);

    const pageHeading = new AccentTypographyBuilder(
      `.rules__title`,
      650, `transform`,
      `active`,
      [[3, 2, 1, 3, 2, 1]],
    );

    rulesScreen.addAnimation(() => {
      pageHeading.run();
    }, 500);

    screensAnimations[Screens.RULES] = rulesScreen;
  }

  {
    const gameScreen = new ScreenAnimationTimeline(Screens.GAME);

    const pageHeading = new AccentTypographyBuilder(
      `.game__title`,
      650, `transform`,
      `active`,
      [[3, 2, 1, 2]],
    );

    gameScreen.addAnimation(() => {
      pageHeading.run();
    }, 500);

    screensAnimations[Screens.GAME] = gameScreen;
  }


  document.body.addEventListener(`screenChanged`, ({ detail }) => {
    if (detail.screenName === `prizes` || detail.screenName === `rules`) {
      setTimeout(() => {
        document.body.classList.add(`--footer-opacity`);
      }, 1000);
    } else {
      document.body.classList.remove(`--footer-opacity`);
    }

    if (screensAnimations.hasOwnProperty(detail.screenName)) {
      screensAnimations[detail.screenName].run();
    }
  });
};
