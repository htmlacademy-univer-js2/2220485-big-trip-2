import AbstractView from '../framework/view/abstract-view.js';

const createAddNewPointButtonTemplate = () => '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';

export default class NewPointButtonView extends AbstractView {

  get template() {
    return createAddNewPointButtonTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.clickNewPoint = callback;
    this.element.addEventListener('click', this.#clickNewPointHandler);
  };

  #clickNewPointHandler = (evt) => {
    evt.preventDefault();
    this._callback.clickNewPoint();
  };
}
