import Observable from '../framework/observable.js';

export default class TravelPointsModel extends Observable {
  #travelPoints = [];
  #offers = [];

  init(travelPoints, offers) {
    this.#travelPoints = travelPoints;
    this.#offers = offers;
  }

  get travelPoints() {
    return this.#travelPoints;
  }

  get offers() {
    return this.#offers;
  }

  updatePoint = (updateType, update) => {
    const index = this.#travelPoints.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#travelPoints = [
      ...this.#travelPoints.slice(0, index),
      update,
      ...this.#travelPoints.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  addPoint = (updateType, update) => {
    this.#travelPoints = [
      update,
      ...this.#travelPoints,
    ];

    this._notify(updateType, update);
  };

  deletePoint = (updateType, update) => {
    const index = this.#travelPoints.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#travelPoints = [
      ...this.#travelPoints.slice(0, index),
      ...this.#travelPoints.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
