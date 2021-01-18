import AccentTypographyBuilder from "./AccentTypographyBuilder";

export default () => {
  const letterAnimationOrdering = [
    // Т, А, И, Н, С, Т, В, Е, Н, Н, Ы, Й
    [4, 2, 1, 2, 3, 2, 1, 5, 3, 1, 3, 1],
    // О, Т, П, У, С, К
    [7, 8, 6, 5, 7, 5]
  ];

  const mainHeading = new AccentTypographyBuilder(`.intro__title`, 650, `transform`, `active`, letterAnimationOrdering);

  setTimeout(() => {
    mainHeading.run();
  }, 600);
};
