import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view';


const getPointDestinationNames = (points) => {
  const destinationNames = points.map((point) => point.destinationName);
  if (destinationNames.length === 0) {
    return `${destinationNames[0]}`;
  }

  else if (destinationNames.length === 2) {
    return `${destinationNames[0]} &mdash; ${destinationNames[1]}`;
  }

  else if (destinationNames.length === 3) {
    return `${destinationNames[0]} &mdash; ${destinationNames[1]} &mdash; ${destinationNames[2]}`;
  }

  else {
    return `${destinationNames[0]} &mdash; ... &mdash;${destinationNames[destinationNames.length - 1]}`;
  }
};

const getPricePointOffers = (point, offers) => {
  if (offers.length === 0) {
    return 0;
  }

  let pricePointOffers = 0;
  const offersByType = offers.find((offer) => offer.type === point.type).offers;
  const pointOffers = point.offers;
  pointOffers.forEach((offer) => {
    pricePointOffers += offersByType.find((el) => el.id === offer).price;
  });

  return pricePointOffers;
};

const getTotalPricePoints = (points, offers) => {
  if (points.length === 0) {
    return '';
  }

  let totalPrice = 0;
  points.forEach((point) => {
    totalPrice += point.basePrice;
    totalPrice += getPricePointOffers(point, offers);
  });

  return totalPrice;
};

const getPointsDates = (points) => {
  const startDate = points[0].dateFrom;
  const endDate = points[points.length - 1].dateTo;

  return `${dayjs(startDate).format('D MMM')}&nbsp;&mdash;&nbsp;${dayjs(endDate).format('D MMM')}`;
};

const createPointInfoTemplate = (points, allOffers, allDestinations) => {
  const allPoints = points.map((point) => ({
    ...point,
    destinationName: allDestinations.find(({ id }) => id === point.destination).name
  }));

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${getPointDestinationNames(allPoints)}</h1>
              <p class="trip-info__dates">${getPointsDates(allPoints)}</p>
            </div>
            <p class="trip-info__cost">
            Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalPricePoints(points, allOffers)}</span>
            </p>
          </section>`;
};

export default class PointInfoView extends AbstractView {
  #point = null;
  #allOffers = null;
  #allDestinations = null;

  constructor(points, allOffers, allDestinations) {
    super();
    this.#point = points;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
  }

  get template() {
    return createPointInfoTemplate(this.#point, this.#allOffers, this.#allDestinations);
  }
}
