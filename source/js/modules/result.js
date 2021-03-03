import game from "./game";
import runWinScene from "./canvas/winScene";
import runFailedScene from "./canvas/failedScene";

export default () => {
  let showResultEls = document.querySelectorAll(`.js-show-result`);
  let results = document.querySelectorAll(`.screen--result`);
  if (results.length) {
    for (let i = 0; i < showResultEls.length; i++) {
      showResultEls[i].addEventListener(`click`, function () {
        let target = showResultEls[i].getAttribute(`data-target`);
        [].slice.call(results).forEach(function (el) {
          el.classList.remove(`screen--show`);
          el.classList.add(`screen--hidden`);
        });
        let targetEl = [].slice.call(results).filter(function (el) {
          return el.getAttribute(`id`) === target;
        });
        targetEl[0].classList.add(`screen--show`);
        targetEl[0].classList.remove(`screen--hidden`);

        const svgStartAnimation = targetEl[0].querySelector(`svg animate#startAnimation${target}`);

        // запускаем анимацию canvas
        switch (target) {
          case `result` : runWinScene(); break;
          case `result3` : runFailedScene(); break;
        }

        setTimeout(() => {
          svgStartAnimation.beginElement();
        }, 800);
      });
    }

    let playBtn = document.querySelector(`.js-play`);
    if (playBtn) {
      playBtn.addEventListener(`click`, function () {
        [].slice.call(results).forEach(function (el) {
          el.classList.remove(`screen--show`);
          el.classList.add(`screen--hidden`);
        });
        document.getElementById(`messages`).innerHTML = ``;
        document.getElementById(`message-field`).focus();

        game(`#game-timer`).start();
      });
    }
  }
};
