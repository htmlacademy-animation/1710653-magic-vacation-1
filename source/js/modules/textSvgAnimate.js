export default () => {
  const svg = document.getElementById(`win-svg`);
  const svg2 = document.getElementById(`win-2-svg`);

  const allAnimation = [];
  /**
   * Создание анимации для path
   *
   * @param lineWidth
   * @param point
   * @param duration
   * @returns {HTMLElement}
   */
  const createAnimation = (lineWidth, point, duration) => {
    const dash = lineWidth / point;
    const dashArray = Array(point).fill(dash).reduce((result, step) => {
      result.push(step, 0);
      return result;
    }, []);
    const to = dashArray.join(` `);
    const from = dashArray.reverse().join(` `);

    const animation = document.createElement(`animate`);
    animation.setAttributeNS(`attribute`, `attributeName`, `stroke-dasharray`);
    animation.setAttribute(`from`, from);
    animation.setAttribute(`to`, to);
    animation.setAttribute(`dur`, duration);
    animation.setAttribute(`begin`, `infinite`);
    animation.setAttribute(`fill`, `freeze`);

    return {animation, from};
  };

  const createSvgPathAnimation = (svgEl) => {
    svgEl.querySelectorAll(`path`).forEach((path) => {
      const dashWidth = path.getTotalLength();

      const {animation, from} = createAnimation(dashWidth, 3, `1s`);
      path.appendChild(animation);
      path.setAttribute(`stroke-dasharray`, from);

      allAnimation.push(animation);
    });
  };


  let allAN = document.querySelectorAll(`.win-text-svg animate`);

  setTimeout(() => {
    allAN.forEach(a => {
      a.beginElement();
    });
  }, 1000);
};
