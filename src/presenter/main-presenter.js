import TripEditView from '../view/trip-edit-view.js';
import TripPointsListView from '../view/points-list-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripPointView from '../view/trip-point-view.js';
import TripMenuView from '../view/menu-view.js';
import TripFilterView from '../view/trip-filter-view.js';
import { render } from '../render.js';

export default class MainPresenter {
  #tripEventsContainer = null;
  #tripControlsContainer = null;
  #travelPointModel = null;
  #boardTravelPointModel = null;

  #pointListComponent = new TripPointsListView();

  constructor(tripEventsElement,tripControlsElement) {
    this.#tripEventsContainer = tripEventsElement;
    this.#tripControlsContainer = tripControlsElement;
  }

  init (travelPointModel) {
    this.#travelPointModel = travelPointModel;
    this.#boardTravelPointModel = [...this.#travelPointModel.travelPoints];

    render(new TripMenuView(), this.#tripControlsContainer);
    render(new TripFilterView(), this.#tripControlsContainer);

    render(new TripSortView(), this.#tripEventsContainer);
    render(this.#pointListComponent, this.#tripEventsContainer);

    for (const travelPoint of this.#boardTravelPointModel) {
      this.#renderPoint(travelPoint);
    }
  }

  #renderPoint = (point) => {
    const pointComponent = new TripPointView(point);
    const pointEditComponent = new TripEditView(point);

    const replacePointToForm = () => {
      this.#pointListComponent.element.replaceChild(pointEditComponent.element, pointComponent.element);
    };

    const replaceFormToPoint = () => {
      this.#pointListComponent.element.replaceChild(pointComponent.element, pointEditComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#pointListComponent.element);
  };
}
