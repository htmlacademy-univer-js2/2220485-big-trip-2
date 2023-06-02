import { render, remove, RenderPosition } from '../framework/render.js';
import TripEditView from '../view/trip-edit-view.js';
import { UserAction, UpdateType } from '../consts.js';
import { nanoid } from 'nanoid';

export default class PointNewPresenter {
  #pointEditComponent = null;
  #pointListComponent = null;
  #travelPointModel = null;
  #changeData = null;
  #offers = null;
  #destroyCallback = null;

  constructor(pointListComponent, changeData, travelPointModel){
    this.#pointListComponent = pointListComponent;
    this.#travelPointModel = travelPointModel;
    this.#changeData = changeData;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#pointEditComponent !== null) {
      return;
    }
    this.#offers = [...this.#travelPointModel.offers];

    this.#pointEditComponent = new TripEditView({
      point: this.travelPointModel,
      offers: this.#offers,
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

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      { id: nanoid(), ...point },
    );
    this.destroy();
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
