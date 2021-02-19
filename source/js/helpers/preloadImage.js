/**
 * Предварительная загрузка картинки для нужного <img/>
 * @param {String} url
 * @param {HTMLImageElement} image
 * @return {Promise<Event>}
 */
export const preloadImage = (url, image = null) => {
  if (!image) {
    image = new Image();
  }
  return new Promise((resolve, reject) => {
    image.addEventListener(`load`, resolve);
    image.addEventListener(`error`, reject);
    image.src = url;
  });
};
