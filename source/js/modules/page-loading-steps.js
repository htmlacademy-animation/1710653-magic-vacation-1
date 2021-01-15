export default () => {
  const body = document.body;

  document.addEventListener(`DOMContentLoaded`, () => {
    setTimeout(() => {
      body.classList.add(`page-loaded`);
    }, 100);
  });
};
