import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { DESTINATIONS, TYPES } from '../consts.js';
import { capitalizeFirstLetter } from '../utils/common.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';

const renderOffers = (allOffers, checkedOffers) => {
  let result = '';
  allOffers.forEach((offer) => {
    const checked = checkedOffers.includes(offer.id) ? 'checked' : '';
    result = `${result}<div class="event__available-offers">
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${offer.id}" type="checkbox" name="event-offer-luggage" ${checked}>
      <label class="event__offer-label" for="event-offer-luggage-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  });
  return result;
};

const createDestinationsOptionsTemplate = (destinations) =>
  destinations.reduce((result, destination) =>
    result.concat(`<option value="${destination.name}"></option>\n`), '');

const createDestinationDescriptionTemplate = (destinations, name) => destinations.find((el) => el.name === name).description;

const createDestinationPicturesTemplate = (destinations, name) => {
  const src = destinations.find((el) => el.name === name).pictures[0].src;
  const description = destinations.find((el) => el.name === name).pictures[0].description;
  return `<img class="event__photo" src="${src}" alt="${description}">`;
};

const createTypePointTemplate = (checkedType) => TYPES.map((type) => `<div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${(checkedType === type) ? 'checked' : ''}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalizeFirstLetter(type)}</label>
        </div>`).join('');

const createTripEditTemplate = (point, offers) => {
  const { destinationId, type, offerIds } = point;
  const destinationName = DESTINATIONS.find((el) => el.id === destinationId).name;
  const allPointTypeOffers = offers.find((offer) => offer.type === type);


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
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${createDestinationsOptionsTemplate(DESTINATIONS)}
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
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="160">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          ${renderOffers(allPointTypeOffers.offers, offerIds)}
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${createDestinationDescriptionTemplate(DESTINATIONS, destinationName)}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${createDestinationPicturesTemplate(DESTINATIONS, destinationName)}
          </div>
        </div>
      </section>
    </section>
  </form>
</li>`);
};

export default class TripEditView extends AbstractStatefulView {
  #point = null;
  #offers = null;
  #datepickerDateFrom = null;
  #datepickerDateTo = null;

  constructor(point, offers) {
    super();
    this._state = TripEditView.parsePointToState(point);
    this.#offers = offers;

    this.#setInnerHandlers();
    this.#setOuterHandlers();
    this.#setDatepickerDateFrom();
    this.#setDatepickerDateTo();
  }

  get template() {
    return createTripEditTemplate(this._state, this.#offers);
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
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editFormClick();
  };

  reset = (point) => this.updateElement(TripEditView.parsePointToState(point));

  setEditFormSubmitHandler = (callback) => {
    this._callback.submitForm = callback;
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#submitHandler);
    this.element.querySelector('form').addEventListener('submit', this.#submitHandler);
  };

  #submitHandler = (evt) => {
    evt.preventDefault();
    this._callback.submitForm(TripEditView.parseStateToPoint(this._state));
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setOuterHandlers();
    this.#setDatepickerDateFrom();
    this.#setDatepickerDateTo();
  };

  #typePointChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offerIds: []
    });
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();
    const checkedOfferId = Number(evt.target.id.slice(-1));
    const offerIds = this._state.offerIds.filter((n) => n !== checkedOfferId);
    if (offerIds.length !== this._state.offerIds.length) {
      this._state.offerIds =  offerIds;
    }
    else {
      this._state.offerIds.push(checkedOfferId);
    }
    this.updateElement({
      offerIds: this._state.offerIds,
    });
  };

  #destinationChangeHandler = (evt) => {
    const city = evt.target.value;
    if (city === undefined) {
      this.reset(this._state);
    } else {
      const id = DESTINATIONS.find((el) => el.name === city).id;
      this.updateElement({ destinationId: id});
    }
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: dayjs(userDate).toDate(),
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: dayjs(userDate).toDate(),
    });
  };

  #setDatepickerDateFrom = () => {
    this.#datepickerDateFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        enableTime: true,
        maxDate: this._state.dateTo,
        time_24hr: true,
        onChange: this.#dateFromChangeHandler,
      },
    );
  };

  #setDatepickerDateTo = () => {
    this.#datepickerDateTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        enableTime: true,
        minDate: this._state.dateFrom,
        time_24hr: true,
        onChange: this.#dateToChangeHandler,
      },
    );
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('change', this.#typePointChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offersChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
  };

  #setOuterHandlers = () => {
    this.setEditFormSubmitHandler(this._callback.submitForm);
    this.setEditFormClickHandler(this._callback.editFormClick);
  };

  static parsePointToState = (point) => ({
    ...point,
    dateTo: dayjs(point.dateTo).toDate(),
    dateFrom: dayjs(point.dateFrom).toDate(),
  });

  static parseStateToPoint = (state) => {
    const point = {...state};
    return point;
  };
}
