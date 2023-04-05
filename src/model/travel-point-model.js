export default class TravelPointsModel {
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
}
