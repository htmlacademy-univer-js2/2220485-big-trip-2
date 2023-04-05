import TripEditView from '../view/trip-edit-view.js';
import TripPointsListView from '../view/points-list-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripPointView from '../view/trip-point-view.js';
import TripMenuView from '../view/menu-view.js';
import TripFilterView from '../view/trip-filter-view.js';
import NoPointsMessageView from '../view/no-points-message-view.js';
import { render } from '../framework/render.js';

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
      render(new TripFilterView(), this.#tripControlsContainer);

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
      this.#pointListComponent.element.replaceChild(pointEditComponent.element, previewPointComponent.element);
    };

    const replaceEditFormToPreviewPoint = () => {
      this.#pointListComponent.element.replaceChild(previewPointComponent.element, pointEditComponent.element);
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
