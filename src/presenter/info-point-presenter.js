import { render, remove, RenderPosition } from '../framework/render.js';
import { sortByDay } from '../utils/travel-point.js';
import PointInfoView from '../view/point-info-view.js';

export default class PointInfoPresenter {
  #pointsInfoContainer = null;
  #travelPointsModel = null;
  #pointsInfoComponent = null;

  constructor(pointsInfoContainer, travelPointsModel) {
    this.#pointsInfoContainer = pointsInfoContainer;
    this.#travelPointsModel = travelPointsModel;

    this.#travelPointsModel.addObserver(this.#modelEventHandler);
  }

  get points() {
    return this.#travelPointsModel.travelPoints.sort(sortByDay);
  }

  get offers() {
    return this.#travelPointsModel.offers;
  }

  get destinations() {
    return this.#travelPointsModel.destinations;
  }

  init = () => {

    if (this.#pointsInfoComponent instanceof PointInfoView) {
      remove(this.#pointsInfoComponent);

    }

    if (this.points.length) {
      this.#pointsInfoComponent = new PointInfoView(this.points, this.offers, this.destinations);
      render(this.#pointsInfoComponent, this.#pointsInfoContainer, RenderPosition.AFTERBEGIN);
    }
  };


  destroy = () => {
    if (!this.#pointsInfoComponent) {
      return;
    }

    remove(this.#pointsInfoComponent);
    this.#pointsInfoComponent = null;
  };

  #modelEventHandler = () => {
    this.init();
  };
}
