export default class TravelPointsModel {
  #travelPoints = null;

  constructor() {
    this.#travelPoints = [];
  }

  init(travelPoints) {
    this.#travelPoints = travelPoints;
  }

  get travelPoints() {
    return this.#travelPoints;
  }
}
