import TripPointsListView from '../view/points-list-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripMenuView from '../view/menu-view.js';
import TripFilterView from '../view/trip-filter-view.js';
import NoPointsMessageView from '../view/no-points-message-view.js';
import { render, RenderPosition } from '../framework/render.js';
import { generateFilter } from '../mock/filter.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';

export default class MainPresenter {
  #tripEventsContainer = null;
  #tripControlsContainer = null;
  #tripFiltersContainer = null;
  #travelPointModel = null;
  #boardTravelPointModel = null;
  #offers = null;

  #pointListComponent = new TripPointsListView();
  #pointSortComponent = new TripSortView();
  #noPointComponent = new NoPointsMessageView();
  #pointMenuComponent = new TripMenuView();

  #pointPresenter = new Map();

  constructor(tripEventsContainer, tripControlsContainer, tripFiltersContainer,travelPointModel) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#tripControlsContainer = tripControlsContainer;
    this.#tripFiltersContainer = tripFiltersContainer;
    this.#travelPointModel = travelPointModel;
  }

  init() {
    this.#boardTravelPointModel = [...this.#travelPointModel.travelPoints];
    this.#offers = [...this.#travelPointModel.offers];

    if (this.#boardTravelPointModel.length === 0) {
      this.#renderNoPoints();
    } else {
      this.#renderMenu();
      this.#renderFilters();
      this.#renderSort();
      this.#renderPointsList();
    }
  }

  #renderSort = () => {
    render(this.#pointSortComponent,this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  };

  #renderFilters = () => {
    const filters = generateFilter(this.#travelPointModel.travelPoints);
    render(new TripFilterView(filters), this.#tripFiltersContainer);
  };

  #renderPoints = (from, to) => {
    this.#boardTravelPointModel.slice(from, to).forEach((point) => this.#renderPoint(point));
  };

  #renderNoPoints = () => {
    render(this.#noPointComponent, this.#tripEventsContainer);
  };

  #renderMenu = () => {
    render(this.#pointMenuComponent, this.#tripControlsContainer);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent.element, this.#travelPointModel, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPointsList = () => {
    render(this.#pointListComponent, this.#tripEventsContainer);
    this.#renderPoints(0, this.#boardTravelPointModel.length);
  };

  #clearPointsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardTravelPointModel = updateItem(this.#boardTravelPointModel, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };
}

