import FilterView from '../view/point-filter-view.js';
import { render, replace, remove } from '../framework/render.js';
import { filter } from '../utils/filter.js';
import { FilterType, UpdateType } from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #travelPointsModel = null;
  #filterComponent = null;

  constructor(filterContainer, filterModel, travelPointsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#travelPointsModel = travelPointsModel;

    this.#travelPointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#travelPointsModel.travelPoints;

    return [FilterType.EVERYTHING, FilterType.PAST, FilterType.FUTURE].map((type) => ({
      type,
      name: type,
      count: filter[type](points).length,
    }));
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
