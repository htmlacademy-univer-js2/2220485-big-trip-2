import { getRandomInteger, getRandomElement } from '../utils/common.js';
import dayjs from 'dayjs';
import { TYPES, DESTINATIONS } from '../consts.js';
import { nanoid } from 'nanoid';

const Price = {
  MIN: 10,
  MAX: 1000
};

const ElementsCount = {
  MIN: 1,
  MAX: 3
};

const generateType = () => {
  const randomIndex = getRandomInteger(0, TYPES.length - 1);

  return TYPES[randomIndex];
};

const generatePrice = () => getRandomInteger(Price.MIN, Price.MAX);

const generateOffer = (id, type) => ({
  id,
  title: `offer for ${type}`,
  price: generatePrice()
});

const generateOffersByType = (type) => ({
  type,
  offers: Array.from({length: getRandomInteger(ElementsCount.MIN, ElementsCount.MAX)}).map((index) => generateOffer(index + 1, type)),
});

export const getOffersByType = () => Array.from({length: TYPES.length}).map((value, index) => generateOffersByType(TYPES[index]));

const offersByType = getOffersByType();

export const generateTravelPoint = () => {
  const start = dayjs().add(getRandomInteger(-3, -1),'day').add(getRandomInteger(-11, 0),'hour').add(getRandomInteger(-30, 0), 'minute');
  const end = dayjs().add(getRandomInteger(-1, 4),'day').add(getRandomInteger(0, 11),'hour').add(getRandomInteger(0, 30), 'minute');

  const offersByTypePoint = getRandomElement(offersByType);
  const allOfferIdsByTypePoint = offersByTypePoint.offers.map((offer) => offer.id);

  return {
    id:nanoid(),
    basePrice: generatePrice(),
    isFavorite: Boolean(getRandomInteger(0,1)),
    type: generateType(),
    dateFrom: start,
    dateTo: end,
    offerIds: Array.from({length: getRandomInteger(0, allOfferIdsByTypePoint.length)}).map(() => allOfferIdsByTypePoint[getRandomInteger(0, allOfferIdsByTypePoint.length - 1)]),
    destination: getRandomInteger(1, DESTINATIONS.length),
  };
};

export const getTravelPoints = () => Array.from({length: 10}, generateTravelPoint);
