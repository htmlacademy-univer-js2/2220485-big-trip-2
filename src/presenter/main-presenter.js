import TripEditView from '../view/trip-edit-view.js';
import TripPointsListView from '../view/points-list-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripPointView from '../view/trip-point-view.js';
import TripMenuView from '../view/menu-view.js';
import TripFilterView from '../view/trip-filter-view.js';
import NoPointsMessageView from '../view/no-points-message-view.js';
import { render, replace } from '../framework/render.js';
import { generateFilter } from '../mock/filter.js';

export default class MainPresenter {
  #tripEventsContainer = null;
  #tripControlsContainer = null;
  #travelPointModel = null;
  #boardTravelPointModel = null;
  #offers = null;

  #pointListComponent = new TripPointsListView();

  constructor(tripEventsElement,tripControlsElement) {
    this.#tripEventsContainer = tripEventsElement;
    this.#tripControlsContainer = tripControlsElement;
  }

  init (travelPointModel) {
    this.#travelPointModel = travelPointModel;
    this.#boardTravelPointModel = [...this.#travelPointModel.travelPoints];
    this.#offers = [...this.#travelPointModel.offers];

    if (this.#boardTravelPointModel.length === 0) {
      render(new NoPointsMessageView(), this.#tripEventsContainer);
    } else {
      render(new TripMenuView(), this.#tripControlsContainer);
      const controlFiltersElement = document.querySelector('.trip-controls__filters');

      const filters = generateFilter(travelPointModel.travelPoints);

      render(new TripFilterView(filters), controlFiltersElement);

      render(new TripSortView(), this.#tripEventsContainer);
      render(this.#pointListComponent, this.#tripEventsContainer);

      for (const travelPoint of this.#boardTravelPointModel) {
        this.#renderPoint(travelPoint);
      }
    }
  }

  #renderPoint = (point) => {
    const previewPointComponent = new TripPointView(point, this.#offers);
    const pointEditComponent = new TripEditView(point, this.#offers);

    const replacePreviewPointToEditForm = () => {
      replace(pointEditComponent, previewPointComponent);
    };

    const replaceEditFormToPreviewPoint = () => {
      replace(previewPointComponent, pointEditComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditFormToPreviewPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    previewPointComponent.setPreviewPointClickHandler(() => {
      replacePreviewPointToEditForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.setEditFormClickHandler(() => {
      replaceEditFormToPreviewPoint();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.setEditFormSubmitHandler(() => {
      replaceEditFormToPreviewPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(previewPointComponent, this.#pointListComponent.element);
  };
}
