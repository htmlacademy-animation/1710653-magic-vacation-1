import {RGB_ETC1_Format} from "three";

export default class AccentTypographyBuilder {
  constructor(selector, duration, property, runClassName, letterTimeOffsets ) {

    this._selector = selector;
    this._duration = duration;
    this._property = property;
    this._runClassName = runClassName;
    this._letterTimeOffsets = letterTimeOffsets;
    this._element = document.querySelector(selector);
    this._timeOffset = 50;

    this.prepareText();
  }

  createLetter(letter, offsetIndex = 0) {
    const span = document.createElement(`span`);
    span.classList.add(`accent-typography__letter`);
    span.innerText = letter;
    span.style.transition = `${this._property} ${this._duration}ms ${this._timeOffset * offsetIndex}ms`;

    return span;
  }

  prepareText() {
    if (!this._element) {
      return;
    }

    const words = this._element.textContent.split(` `);

    const updatedDOM = words.reduce((wordsFragments, word, index) => {
      const letterOffsets = this._letterTimeOffsets[index];
      const wordLetters = Array.from(word).reduce((fragment, letter, letterIndex) => {

        const offsetIndex = letterOffsets && letterOffsets.length > 0 && letterOffsets[letterIndex];
        fragment.appendChild(this.createLetter(letter, offsetIndex));

        return fragment;
      }, document.createDocumentFragment());

      const wordElement = document.createElement(`span`);
      wordElement.classList.add(`accent-typography__word`);
      wordElement.appendChild(wordLetters);

      wordsFragments.appendChild(wordElement);
      return wordsFragments;
    }, document.createDocumentFragment());

    this._element.innerHTML = ``;
    this._element.appendChild(updatedDOM);

    this._element.classList.add(`accent-typography`);
  }

  run() {
    if (!this._element) {
      return;
    }

    this._element.classList.add(this._runClassName);
  }
  destroy() {
    if (!this._element) {
      return;
    }

    this._element.classList.remove(this._runClassName);
  }
}

