import { createElement } from '../render.js';
import dayjs from 'dayjs';
import { duration } from '../utils.js';
import { offersArray } from '../mock/offers.js';
import { DESTINATIONS } from '../consts.js';

const createOfferTemplate = (offers) =>
  offers.reduce((result, offer) => {
    const offerInformation = offersArray.find((el) => el.id === offer);
    return result.concat(
      `<li class="event__offer">
        <span class="event__offer-title">${offerInformation.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offerInformation.price}</span>
      </li>`);
  }, '');


const createOffersListTemplate = (offers) =>
  offers.length > 0  ?
    `<ul class="event__selected-offers">${createOfferTemplate(offers)}</ul>`
    : '';

const createTripEventTemplate = (travelPoint) => {
  const {basePrice, isFavorite, type, dateFrom, dateTo, offers, destination} = travelPoint;

  const startDay = dayjs(dateFrom).format('MMM D');
  const endDay = dayjs(dateTo).format('MMM D');
  const startDate = dayjs(dateFrom).format('YYYY-MM-DD');
  const startTime = dayjs(dateFrom).format('HH:mm');
  const endTime = dayjs(dateTo).format('HH:mm');
  const startDayWithTime = dayjs(dateFrom).format('YYYY-MM-DD HH:mm');
  const endDayWithTime = dayjs(dateTo).format('YYYY-MM-DDT HH:mm');

  const rightStartDate = (startDay === endDay) ? startTime : startDay;
  const rightEndDate = (startDay === endDay) ? endTime : endDay;

  const name = DESTINATIONS.find((item) => (item.id === destination)).name;
  const eventDuration = duration(dateFrom, dateTo);

  return (`<li class="trip-events__item">
    <div class="event">
    <time class="event__date" datetime="${startDate}">${startDay}</time>  <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${name}</h3>
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
      ${createOffersListTemplate(offers)}
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

export default class TripEventView {
  constructor(point) {
    this.point = point;
  }

  getTemplate() {
    return createTripEventTemplate(this.point);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

