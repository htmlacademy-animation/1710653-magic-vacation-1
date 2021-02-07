export default () => {
  const svg = document.getElementById(`win-svg`);
  const svg2 = document.getElementById(`win-2-svg`);
  const loseSvg = document.getElementById(`loser-svg`);

  /**
   * Точки падения букв проигрыша
   * @type {number[][]}
   */
  const animationTransformValues = [
    [0, -100],
    [0, 0],
    [0, -30],
    [0, 0],
    [0, -10],
    [0, -0]
  ];

  const transformValueText = animationTransformValues.map((points) => points.join(` `)).join(`;`);

  const allAnimation = [];

  /**
   * Создание анимации для path
   *
   * @param lineWidth
   * @param point
   * @param duration
   * @param delay
   * @returns {HTMLElement}
   */
  const createAnimation = (lineWidth, point, duration, delay, startContur) => {
    const dash = lineWidth / point;
    const dashArray = Array(point).fill(dash).reduce((result, step) => {
      result.push(step, 0);
      return result;
    }, []);
    const to = dashArray.join(` `);
    const from = dashArray.reverse().join(` `);

    /**
     * Анимация появления
     * @type {HTMLElement}
     */
    const animation = document.createElement(`animate`);

    animation.setAttributeNS(`attribute`, `attributeName`, `stroke-dasharray`);
    animation.setAttribute(`from`, from);
    animation.setAttribute(`to`, to);
    animation.setAttribute(`dur`, `${duration / 3}s`);
    animation.setAttribute(`accumulate`, `sum`);
    if (startContur) {
      animation.id = `startAnimation`;
      animation.setAttribute(`begin`, `infinite`);
    } else {
      animation.setAttribute(`begin`, `startAnimation.begin + ${delay}`);
    }

    animation.setAttribute(`fill`, `freeze`);

    // анимация отскока
    const animationTransform = document.createElement(`animateTransform`);

    animationTransform.setAttributeNS(`attribute`, `attributeName`, `transform`);
    animationTransform.setAttributeNS(`attribute`, `keySplines`, `0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1;`);
    animationTransform.setAttributeNS(`attribute`, `calcMode`, `spline`);
    animationTransform.setAttribute(`values`, transformValueText);
    animationTransform.setAttribute(`type`, `translate`);
    animationTransform.setAttribute(`dur`, `${duration}s`);
    animationTransform.setAttribute(`begin`, `startAnimation.begin + ${delay}`);
    animationTransform.setAttribute(`accumulate`, `sum`);

    animationTransform.setAttribute(`fill`, `freeze`);

    return {animation, animationTransform, from};
  };

  const createSvgPathAnimation = (svgEl) => {
    const stepDelay = 0.1;
    let delay = 0;

    svgEl.querySelectorAll(`path`).forEach((path) => {
      const dashWidth = path.getTotalLength();

      const {animation, animationTransform, from} = createAnimation(dashWidth, 3, 1, `${delay}s`, delay === 0);

      delay += stepDelay;
      path.appendChild(animationTransform);
      path.appendChild(animation);
      path.setAttribute(`stroke-dasharray`, from);

      allAnimation.push(animation);
    });
  };

  // createSvgPathAnimation(loseSvg);

  let allAN = document.querySelectorAll(`#startAnimation`);

  setTimeout(() => {
    allAN.forEach((a) => {
      a.beginElement();
    });
  }, 1000);
};
