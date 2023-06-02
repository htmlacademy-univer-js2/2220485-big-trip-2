import TripEditView from '../view/trip-edit-view.js';
import TripPointView from '../view/trip-point-view.js';
import { render, replace, remove } from '../framework/render.js';
import { UpdateType, UserAction } from '../consts.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #point = null;
  #previewPointComponent = null;
  #pointEditComponent = null;
  #pointListComponent = null;

  #offers = null;
  #travelPointModel = null;
  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;
  #isNewPoint = false;

  constructor(pointListComponent, travelPointModel, changeData, changeMode){
    this.#pointListComponent = pointListComponent;
    this.#travelPointModel = travelPointModel;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point) => {
    this.#point = point;
    this.#offers = [...this.#travelPointModel.offers];

    const prevPreviewPointComponent = this.#previewPointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#previewPointComponent = new TripPointView(point, this.#offers);
    this.#pointEditComponent = new TripEditView({point: point, offers: this.#offers, isNewPoint: this.#isNewPoint});

    this.#previewPointComponent.setPreviewPointClickHandler(this.#handlePreviewPointClick);
    this.#pointEditComponent.setEditFormClickHandler(this.#handleEditClick);
    this.#pointEditComponent.setEditFormSubmitHandler(this.#handleEditSubmit);
    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    this.#previewPointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevPointEditComponent === null || prevPreviewPointComponent === null) {
      render(this.#previewPointComponent, this.#pointListComponent);
      return;
    }

    switch(this.#mode) {
      case Mode.DEFAULT:
        replace(this.#previewPointComponent, prevPreviewPointComponent);
        break;

      case Mode.EDITING:
        replace(this.#pointEditComponent, prevPointEditComponent);
    }
  };

  destroy = () => {
    remove(this.#pointEditComponent);
    remove(this.#previewPointComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceEditFormToPreviewPoint();
    }
  };

  #replacePreviewPointToEditForm = () => {
    replace(this.#pointEditComponent, this.#previewPointComponent);
    document.addEventListener('keydown', this.#handleEscKeyDown);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceEditFormToPreviewPoint = () => {
    replace(this.#previewPointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#handleEscKeyDown);
    this.#mode = Mode.DEFAULT;
  };

  #handleEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceEditFormToPreviewPoint();
      document.removeEventListener('keydown', this.#handleEscKeyDown);
    }
  };

  #handlePreviewPointClick = () => {
    this.#replacePreviewPointToEditForm();
  };

  #handleEditClick = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceEditFormToPreviewPoint();
  };

  #handleEditSubmit = (point) => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point);
    this.#replaceEditFormToPreviewPoint();
    document.removeEventListener('keydown', this.#handleEscKeyDown);
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handleDeleteClick = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };
}
