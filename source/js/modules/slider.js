import Swiper from "swiper";

export default () => {
  let storySlider;

  const ThemeSlidesByIndex = [
    `--purple`,
    `--light-blue`,
    `--blue`,
    `--main`,
  ];

  const setPageTheme = () => {
    document.body.dataset.theme = ThemeSlidesByIndex[Math.floor(storySlider.activeIndex / 2)];
  };

  const resetPageTheme = () => {
    delete document.body.dataset.theme;
  };

  const setSlider = function () {
    if (((window.innerWidth / window.innerHeight) < 1) || window.innerWidth < 769) {
      storySlider = new Swiper(`.js-slider`, {
        watchSlidesVisibility: true,
        pagination: {
          el: `.swiper-pagination`,
          type: `bullets`,
        },
        keyboard: {
          enabled: true,
        },
        on: {
          slideChange: () => {
            let sceneIndex = 0;

            switch (storySlider.activeIndex) {
              case 0:
              case 1:
                sceneIndex = 1;
                break;
              case 2:
              case 3:
                sceneIndex = 2;
                break;
              case 4:
              case 5:
                sceneIndex = 3;
                break;
              case 6:
              case 7:
                sceneIndex = 4;
                break;
            }

            const event = new CustomEvent(`slideChanged`, {
              detail: {
                'scene': `SCENE_${sceneIndex}`,
              },
            });

            document.body.dispatchEvent(event);

            setPageTheme();
          },
          resize: () => {
            storySlider.update();
          },
        },
        observer: true,
        observeParents: true,
      });
    } else {
      storySlider = new Swiper(`.js-slider`, {
        slidesPerView: 2,
        slidesPerGroup: 2,
        watchSlidesVisibility: true,
        pagination: {
          el: `.swiper-pagination`,
          type: `fraction`,
        },
        navigation: {
          nextEl: `.js-control-next`,
          prevEl: `.js-control-prev`,
        },
        keyboard: {
          enabled: true,
        },
        on: {
          slideChange: () => {
            let sceneIndex = 0;

            switch (storySlider.activeIndex) {
              case 0:
              case 1:
                sceneIndex = 1;
                break;
              case 2:
              case 3:
                sceneIndex = 2;
                break;
              case 4:
              case 5:
                sceneIndex = 3;
                break;
              case 6:
              case 7:
                sceneIndex = 4;
                break;
            }

            const event = new CustomEvent(`slideChanged`, {
              detail: {
                'scene': `SCENE_${sceneIndex}`,
              },
            });

            document.body.dispatchEvent(event);

            setPageTheme();
          },
          resize: () => {
            storySlider.update();
          },
        },
        observer: true,
        observeParents: true,
      });
    }
  };

  document.body.addEventListener(`screenChanged`, (event) => {
    if (storySlider && event.detail.screenName === `story`) {
      storySlider.slideTo(0, 0); // ресетим первый слайд, чтобы потом не заморачиваться с отслеживанием слайда и переключения сцены
      setPageTheme();
    } else {
      resetPageTheme();
    }
  });

  window.addEventListener(`resize`, function () {
    if (storySlider) {
      storySlider.destroy();
    }
    setSlider();
  });

  setSlider();
};
