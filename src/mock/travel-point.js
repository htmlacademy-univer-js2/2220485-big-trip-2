import { getRandomInteger } from '../utils.js';
import dayjs from 'dayjs';
import { TYPES, DESTINATIONS } from '../consts.js';
import { offersArray } from './offers.js';

const generateType = () => {
  const randomIndex = getRandomInteger(0, TYPES.length - 1);

  return TYPES[randomIndex];
};

const generatePrice = () => getRandomInteger(10,1000);

export const generateTravelPoint = () => {
  const start = dayjs().add(getRandomInteger(-1, 0),'day').add(getRandomInteger(-11, 0),'hour').add(getRandomInteger(-30, 0), 'minute');
  const end = dayjs().add(getRandomInteger(0, 1),'day').add(getRandomInteger(0, 11),'hour').add(getRandomInteger(0, 30), 'minute');

  return {
    basePrice: generatePrice(),
    isFavorite: Boolean(getRandomInteger(0,1)),
    type: generateType(),
    dateFrom: start,
    dateTo: end,
    offers: [...new Set(Array.from({length: getRandomInteger(0, offersArray.length) }, () => getRandomInteger(1, offersArray.length - 1)))],
    destination: getRandomInteger(1, DESTINATIONS.length),
  };
};

export const getTravelPoints = () => Array.from({length: 5}, generateTravelPoint);
