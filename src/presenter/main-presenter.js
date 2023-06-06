import TripPointsListView from '../view/points-list-view.js';
import TripSortView from '../view/point-sort-view.js';
import TripMenuView from '../view/menu-view.js';
import NoPointsMessageView from '../view/no-points-message-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { FilterType, SortType, TimeLimit, UpdateType, UserAction } from '../consts.js';
import { sortByPrice, sortByDuration, sortByDay } from '../utils/travel-point.js';
import { filter } from '../utils/filter.js';
import PointNewPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class MainPresenter {
  #tripPointsContainer = null;
  #tripControlsContainer = null;

  #travelPointModel = null;
  #filterModel = null;

  #noPointComponent = null;
  #pointListComponent = new TripPointsListView();
  #pointSortComponent = null;
  #pointMenuComponent = new TripMenuView();
  #loadingComponent = new LoadingView();

  #pointPresenter = new Map();
  #pointNewPresenter = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);


  constructor(tripPointsContainer, tripControlsContainer, travelPointModel, filterModel) {
    this.#tripPointsContainer = tripPointsContainer;
    this.#tripControlsContainer = tripControlsContainer;
    this.#travelPointModel = travelPointModel;
    this.#filterModel = filterModel;

    this.#pointNewPresenter = new PointNewPresenter(this.#pointListComponent.element, this.#handleViewAction);

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

  get offers() {
    return this.#travelPointModel.offers;
  }

  get destinations() {
    return this.#travelPointModel.destinations;
  }

  init() {
    this.#renderBroadPoints();
  }

  createPoint = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(callback, this.offers, this.destinations);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#tripPointsContainer, RenderPosition.AFTERBEGIN);
  };

  #renderBroadPoints = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

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
    remove(this.#loadingComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderSort = () => {
    this.#pointSortComponent = new TripSortView(this.#currentSortType);
    this.#pointSortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#pointSortComponent,this.#tripPointsContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent.element, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point, this.offers, this.destinations);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (travelPoints) => {
    travelPoints.forEach((point) => this.#renderPoint(point));
  };

  #renderNoPoints = () => {
    this.#noPointComponent = new NoPointsMessageView( this.#filterType);
    render(this.#noPointComponent, this.#tripPointsContainer, RenderPosition.AFTERBEGIN);
  };

  #renderMenu = () => {
    render(this.#pointMenuComponent, this.#tripControlsContainer);
  };

  #renderPointsList = (travelPoints) => {
    render(this.#pointListComponent, this.#tripPointsContainer);
    this.#renderPoints(travelPoints);
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#travelPointModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointNewPresenter.setSaving();
        try {
          await this.#travelPointModel.addPoint(updateType, update);
        } catch(err) {
          this.#pointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#travelPointModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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

