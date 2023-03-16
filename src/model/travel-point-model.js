import { generateTravelPoint } from "../mock/travel-point";

export default class TravelPointsModel {
  points = Array.from({length: 5}, generateTravelPoint);

  getTravelPoints = () => this.points;
}
