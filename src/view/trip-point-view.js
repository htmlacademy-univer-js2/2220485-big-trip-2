import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';
import { duration } from '../utils/travel-point.js';
import { DESTINATIONS } from '../consts.js';

const renderOffers = (allOffers, checkedOffers) => {
  let result = '';
  allOffers.forEach((offer) => {
    if (checkedOffers.includes(offer.id)) {
      result = `${result}<li class="event__offer"><span class="event__offer-title">${offer.title}</span>&plus;&euro;&nbsp;<span class="event__offer-price">${offer.price}</span></li>`;
    }
  });
  return result;
};

const createTripPointsTemplate = (travelPoint, offers) => {
  const {basePrice, isFavorite, type, dateFrom, dateTo, offerIds, destinationId} = travelPoint;

  const startDay = dayjs(dateFrom).format('MMM D');
  const endDay = dayjs(dateTo).format('MMM D');
  const startDate = dayjs(dateFrom).format('YYYY-MM-DD');
  const startTime = dayjs(dateFrom).format('HH:mm');
  const endTime = dayjs(dateTo).format('HH:mm');
  const startDayWithTime = dayjs(dateFrom).format('YYYY-MM-DD HH:mm');
  const endDayWithTime = dayjs(dateTo).format('YYYY-MM-DDT HH:mm');

  const rightStartDate = (startDay === endDay) ? startTime : startDay;
  const rightEndDate = (startDay === endDay) ? endTime : endDay;

  const destinationName = DESTINATIONS.find((item) => (item.id === destinationId)).name;
  const eventDuration = duration(dateFrom, dateTo);

  const allPointTypeOffers = offers.find((offer) => offer.type === type);

  return (`<li class="trip-events__item">
    <div class="event">
    <time class="event__date" datetime="${startDate}">${startDay}</time>  <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destinationName}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${startDayWithTime}">${rightStartDate}</time>
          &mdash;
          <time class="event__end-time" datetime="${endDayWithTime}">${rightEndDate}</time>
        </p>
        <p class="event__duration">${eventDuration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${renderOffers(allPointTypeOffers.offers, offerIds)}
      </ul>
      <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''} " type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
    </li>`);
};

export default class TripPointView extends AbstractView {
  #point = null;
  #offers = null;

  constructor(point, offers) {
    super();
    this.#point = point;
    this.#offers = offers;
  }

  get template() {
    return createTripPointsTemplate(this.#point, this.#offers);
  }

  setPreviewPointClickHandler = (callback) => {
    this._callback.PreviewPointClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.PreviewPointClick();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
