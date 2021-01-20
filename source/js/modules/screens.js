import AccentTypographyBuilder from "./AccentTypographyBuilder";

class ScreenAnimationTimeline {
  constructor(id) {
    this._id = id;
    this.played = false;
    this.animations = [];
  }

  _run() {
    this.played = true;

    for (const animationCallback of this.animations) {
      if (typeof animationCallback === `function`) {
        animationCallback();
      }
    }
  }

  addAnimation(callback, delay) {
    this.animations.push(() => setTimeout(() => callback(), delay));
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

    const pageHeading = new AccentTypographyBuilder(
      `.prizes__title`,
      650, `transform`,
      `active`,
      [[3, 2, 1, 2, 3]],
    );

    prizesScreen.addAnimation(() => {
      pageHeading.run();
    }, 500);

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


  document.body.addEventListener(`screenChanged`, ({detail}) => {
    if (screensAnimations.hasOwnProperty(detail.screenName)) {
      screensAnimations[detail.screenName].run();
    }
  });
};
