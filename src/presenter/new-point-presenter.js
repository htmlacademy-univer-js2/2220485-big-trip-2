import { render, remove, RenderPosition } from '../framework/render.js';
import TripEditView from '../view/point-edit-view.js';
import { UserAction, UpdateType } from '../consts.js';

export default class PointNewPresenter {
  #pointEditComponent = null;
  #pointListComponent = null;
  #changeData = null;
  #offers = null;
  #destinations = null;
  #destroyCallback = null;

  constructor(pointListComponent, changeData){
    this.#pointListComponent = pointListComponent;
    this.#changeData = changeData;
  }

  init = (callback, offers, destinations) => {
    this.#destroyCallback = callback;

    if (this.#pointEditComponent !== null) {
      return;
    }
    this.#offers = offers;
    this.#destinations = destinations;

    this.#pointEditComponent = new TripEditView({
      point: this.travelPointModel,
      offers: this.#offers,
      destinations: this.#destinations,
      isNewPoint: true
    });

    this.#pointEditComponent.setEditFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#pointEditComponent, this.#pointListComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving = () => {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleDeleteClick = () => {
    this.destroy();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}
