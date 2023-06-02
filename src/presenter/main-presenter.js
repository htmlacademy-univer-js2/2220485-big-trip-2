import TripPointsListView from '../view/points-list-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripMenuView from '../view/menu-view.js';
import NoPointsMessageView from '../view/no-points-message-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { FilterType, SortType, UpdateType, UserAction } from '../consts.js';
import { sortByPrice, sortByDuration, sortByDay } from '../utils/travel-point.js';
import { filter } from '../utils/filter.js';
import PointNewPresenter from './new-point-presenter.js';

export default class MainPresenter {
  #tripEventsContainer = null;
  #tripControlsContainer = null;

  #travelPointModel = null;
  #filterModel = null;

  #offers = null;
  #noPointComponent = null;
  #pointListComponent = new TripPointsListView();
  #pointSortComponent = null;
  #pointMenuComponent = new TripMenuView();

  #pointPresenter = new Map();
  #pointNewPresenter = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  constructor(tripEventsContainer, tripControlsContainer, travelPointModel, filterModel) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#tripControlsContainer = tripControlsContainer;
    this.#travelPointModel = travelPointModel;
    this.#filterModel = filterModel;

    this.#pointNewPresenter = new PointNewPresenter(this.#pointListComponent.element, this.#handleViewAction, this.#travelPointModel);

    this.#travelPointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get travelPoints() {
    this.#filterType = this.#filterModel.filter;
    const travelPoints = this.#travelPointModel.travelPoints;
    const filteredPoints = filter[this.#filterType](travelPoints);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortByDay);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortByDuration);
    }

    return filteredPoints;
  }

  init() {
    this.#renderBroadPoints();
  }

  createPoint = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(callback);
  };

  #renderBroadPoints = () => {
    const travelPoints = this.travelPoints;

    if (travelPoints.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderMenu();
    this.#renderSort();
    this.#renderPointsList(travelPoints);
  };

  #clearBoardPoints = ({resetSortType = false} = {}) => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#pointSortComponent);
    remove(this.#noPointComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderSort = () => {
    this.#pointSortComponent = new TripSortView(this.#currentSortType);
    this.#pointSortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#pointSortComponent,this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent.element, this.#travelPointModel, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (travelPoints) => {
    travelPoints.forEach((point) => this.#renderPoint(point));
  };

  #renderNoPoints = () => {
    this.#noPointComponent = new NoPointsMessageView( this.#filterType);
    render(this.#noPointComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  };

  #renderMenu = () => {
    render(this.#pointMenuComponent, this.#tripControlsContainer);
  };

  #renderPointsList = (travelPoints) => {
    render(this.#pointListComponent, this.#tripEventsContainer);
    this.#renderPoints(travelPoints);
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#travelPointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#travelPointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#travelPointModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoardPoints();
        this.#renderBroadPoints();
        break;
      case UpdateType.MAJOR:
        this.#clearBoardPoints({resetSortType: true});
        this.#renderBroadPoints();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoardPoints();
    this.#renderBroadPoints();
  };

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };
}

