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
  MAX: 5
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

//генерация объекта с типом оффера и массивом с офферами для этого типа
const generateOffersByType = (type) => ({
  type,
  offers: Array.from({length: getRandomInteger(ElementsCount.MIN, ElementsCount.MAX)}).map((value, index) => generateOffer(index + 1, type)),
});

export const getOffersByType = () => Array.from({length: TYPES.length}).map((value, index) => generateOffersByType(TYPES[index]));
//массив с объектами {ключ:тип поинта, значение: массив с офферами для этого типа}
const offersByType = getOffersByType();
// console.log(offersByType);

export const generateTravelPoint = () => {
  const start = dayjs().add(getRandomInteger(-3, -1),'day').add(getRandomInteger(-11, 0),'hour').add(getRandomInteger(-30, 0), 'minute');
  const end = dayjs().add(getRandomInteger(-1, 4),'day').add(getRandomInteger(0, 11),'hour').add(getRandomInteger(0, 30), 'minute');

  const offersByTypePoint = getRandomElement(offersByType);
  const allOfferIdsByTypePoint = offersByTypePoint.offers.map((offer) => offer.id);
  // console.log('offersByTypePoint:', offersByTypePoint);

  // console.log('allOfferIdsByTypePoint:', allOfferIdsByTypePoint);
  // console.log('offerIds', Array.from({length: getRandomInteger(0, allOfferIdsByTypePoint.length)}).map(() => allOfferIdsByTypePoint[getRandomInteger(0, allOfferIdsByTypePoint.length - 1)]));
  return {
    id:nanoid(),
    basePrice: generatePrice(),
    isFavorite: Boolean(getRandomInteger(0,1)),
    // type: generateType(),
    type: offersByTypePoint.type,
    dateFrom: start,
    dateTo: end,
    offerIds: Array.from({length: getRandomInteger(0, allOfferIdsByTypePoint.length)}).map(() => allOfferIdsByTypePoint[getRandomInteger(0, allOfferIdsByTypePoint.length - 1)]),
    // offers: [... new Set(Array.from({ length: getRandomInteger(0, OFFERS.length) }, () => getRandomInteger(1, OFFERS.length - 1)))],
    destinationId: getRandomInteger(1, DESTINATIONS.length),
  };
};

export const getTravelPoints = () => Array.from({length: 10}, generateTravelPoint);
