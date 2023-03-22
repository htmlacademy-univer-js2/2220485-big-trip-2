import { createElement } from '../render.js';

const createNoPointsMessageTemplate = () => `
<p class="trip-events__msg">
Click New Event to create your first point
</p>`;

export default class NoPointsMessageView {
  #element = null;

  get template() {
    return createNoPointsMessageTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
