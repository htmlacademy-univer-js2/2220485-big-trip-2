import TripEditView from '../view/point-edit-view.js';
import TripPointView from '../view/point-view.js';
import { render, replace, remove } from '../framework/render.js';
import { UpdateType, UserAction } from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #point = null;
  #offers = null;
  #destinations = null;
  #previewPointComponent = null;
  #pointEditComponent = null;
  #pointListComponent = null;

  #changeData = null;
  #changeMode = null;
  #mode = Mode.DEFAULT;

  constructor(pointListComponent, changeData, changeMode){
    this.#pointListComponent = pointListComponent;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point, offers, destinations) => {
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    const prevPreviewPointComponent = this.#previewPointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#previewPointComponent = new TripPointView(this.#point, this.#offers, this.#destinations);
    this.#pointEditComponent = new TripEditView({point: this.#point, offers: this.#offers, destinations: this.#destinations, isNewPoint: false});

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
        break;
    }
  };

  destroy = () => {
    remove(this.#pointEditComponent);
    remove(this.#previewPointComponent);
  };

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };


  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointEditComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point, this.#offers, this.#destinations);
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
      this.#pointEditComponent.reset(this.#point, this.#offers, this.#destinations);
      this.#replaceEditFormToPreviewPoint();
      document.removeEventListener('keydown', this.#handleEscKeyDown);
    }
  };

  #handlePreviewPointClick = () => {
    this.#replacePreviewPointToEditForm();
  };

  #handleEditClick = () => {
    this.#pointEditComponent.reset(this.#point,this.#offers,this.#destinations);
    this.#replaceEditFormToPreviewPoint();
  };

  #handleEditSubmit = (point) => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point);
    document.removeEventListener('keydown', this.#handleEscKeyDown);
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  };

  #handleDeleteClick = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };
}
