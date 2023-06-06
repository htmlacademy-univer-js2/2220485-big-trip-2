import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { Type } from '../consts.js';
import { capitalizeFirstLetter } from '../utils/common.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: 1,
  isFavorite: false,
  offers: [],
  type: 'taxi',
};

const findOffersForType = (pointType, allOffers) =>
  allOffers.find(({ type }) => type === pointType).offers;

const createDestinationsOptionsTemplate = (destinations) =>
  destinations.reduce((result, { name }) =>
    result.concat(`<option value="${name}"></option>\n`), '');

const createAvailableOFfersTemplate = (pointOffers, allOffersForType) =>
  allOffersForType.reduce((result, offer) => result.concat(
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.split(' ').pop()}-${offer.id}"
        type="checkbox" name="event-offer-${offer.title.split(' ').pop()}"  ${pointOffers.includes(offer.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.title.split(' ').pop()}-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  ), '');

const createDestinationPicturesTemplate = (pictures) =>
  `<div class="event__photos-container">
      <div class="event__photos-tape">
      ${pictures.reduce((result, picture) =>
    result.concat(`<img class="event__photo" src="${picture.src}" alt="Event photo">`), '')}
      </div>
   </div>`;

const createTypePointTemplate = (checkedType) => Object.values(Type).map((type) => `<div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${(checkedType === type) ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalizeFirstLetter(type)}</label>
        </div>`).join('');

const getSelectedDestinationData = (destinationName, allDestinations) => {
  const selectedDestinationData = allDestinations.find(({ name }) => name === destinationName);
  if (selectedDestinationData === undefined) {
    return {
      name: destinationName,
      description: '',
      pictures: [],
    };
  }
  return selectedDestinationData;
};

const createTripEditTemplate = ({ selectedDestinationName, type, basePrice, offers }, allOffers, allDestinations, isNewPoint) => {
  const selectedDestinationData = getSelectedDestinationData(selectedDestinationName, allDestinations);
  const allOffersForType = findOffersForType(type, allOffers);

  return (`<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createTypePointTemplate(type)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(selectedDestinationName)}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${createDestinationsOptionsTemplate(allDestinations)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 12:25">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 13:35">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>

        ${isNewPoint ? '<button class="event__reset-btn" type="reset">Cancel</button>' :
      `<button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">`}
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${createAvailableOFfersTemplate(offers, allOffersForType)}
          </div>
      </section>

      <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">
          ${selectedDestinationData.description}
          </p>
          ${createDestinationPicturesTemplate(selectedDestinationData.pictures)}
        </section>
    </section>
  </form>
</li>`);
};

export default class TripEditView extends AbstractStatefulView {
  #allOffers = null;
  #allDestinations = null;
  #datepickerDateFrom = null;
  #datepickerDateTo = null;
  #isNewPoint = null;

  constructor({point = BLANK_POINT, offers, destinations, isNewPoint}) {
    super();
    this._state = TripEditView.parsePointToState(point, offers, destinations);
    this.#allOffers = offers;
    this.#allDestinations = destinations;
    this.#isNewPoint = isNewPoint;

    this.#setInnerHandlers();
    this.#setOuterHandlers();
    this.#setDatepickerDateFrom();
    this.#setDatepickerDateTo();
  }

  get template() {
    return createTripEditTemplate(this._state, this.#allOffers,this.#allDestinations, this.#isNewPoint);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerDateFrom) {
      this.#datepickerDateFrom.destroy();
      this.#datepickerDateFrom = null;
    }

    if (this.#datepickerDateTo) {
      this.#datepickerDateTo.destroy();
      this.#datepickerDateTo = null;
    }
  };

  setEditFormClickHandler = (callback) => {
    this._callback.editFormClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickFormHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#editFormDeleteHandler);
  };

  #clickFormHandler = (evt) => {
    evt.preventDefault();
    this._callback.editFormClick();
  };

  reset = (point, offers, destinations) => this.updateElement(TripEditView.parsePointToState(point, offers, destinations));

  setEditFormSubmitHandler = (callback) => {
    this._callback.submitForm = callback;
    // this.element.querySelector('.event__save-btn').addEventListener('click', this.#submitHandler);
    this.element.querySelector('form').addEventListener('submit', this.#submitHandler);
  };

  #submitHandler = (evt) => {
    evt.preventDefault();
    this._callback.submitForm(TripEditView.parseStateToPoint(this._state, this.#allDestinations));
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setOuterHandlers();
    this.#setDatepickerDateFrom();
    this.#setDatepickerDateTo();
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  #typePointChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [],
      availableOffers: this.#allOffers.find((item) => (item.type === evt.target.value)).offer
    });
  };

  #offersChangeHandler = (e) => {
    e.preventDefault();
    const selectedOffers = this._state.offers;
    const clickedOffer = parseInt((e.target.closest('div').childNodes[1].id).match(/\d+/g), 10);
    const clickedOfferId = selectedOffers.indexOf(clickedOffer);

    if (clickedOfferId === -1) {
      selectedOffers.push(clickedOffer);
    } else {
      selectedOffers.splice(clickedOfferId, 1);
    }
    this.updateElement({
      offers: selectedOffers
    });
  };

  #destinationChangeHandler = (e) => {
    e.preventDefault();
    this.updateElement({
      selectedDestinationName: e.target.value,
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setDatepickerDateFrom = () => {
    if (this._state.dateFrom) {
      this.#datepickerDateFrom = flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateFrom,
          enableTime: true,
          maxDate: this._state.dateTo,
          onChange: this.#dateFromChangeHandler,
        },
      );
    }
  };

  #setDatepickerDateTo = () => {
    if (this._state.dateTo) {
      this.#datepickerDateTo = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateTo,
          enableTime: true,
          minDate: this._state.dateFrom,
          onChange: this.#dateToChangeHandler,
        },
      );
    }
  };

  #editFormDeleteHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(TripEditView.parseStateToPoint(this._state, this.#allDestinations));
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('change', this.#typePointChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('click', this.#offersChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
  };

  #setOuterHandlers = () => {
    if (!this.#isNewPoint) {
      this.setEditFormClickHandler(this._callback.editFormClick);
    }
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setEditFormSubmitHandler(this._callback.submitForm);
  };

  static parsePointToState = (point, allOffers, allDestinations) => ({
    ...point,
    selectedDestinationName: allDestinations.find((item) => (item.id === point.destination)).name,
    availableOffers: allOffers.find((item) => (item.type === point.type)).offers,
  });

  static parseStateToPoint = (state, allDestinations) => {
    const point = {
      ...state,
      destination: allDestinations.find((item) => (item.name === state.selectedDestinationName)).id
    };
    delete point.selectedDestinationName;
    delete point.availableOffers;
    return point;
  };
}
