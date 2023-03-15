import { TYPES, OFFERS } from '../consts.js';
import { getRandomInteger } from '../utils.js';

const generateOffersByType = () => {
  const offersByTypes = [];

  for (const type of TYPES) {
    offersByTypes.push({
      type: type,
      offers: [...new Set(Array.from({length:getRandomInteger(1, OFFERS.length)}, () => getRandomInteger(1, OFFERS.length-1)))]
    });
  }
  return offersByTypes;
};

const generateOffersArray = () => {
  const offers = [];

  for (let i = 0; i < OFFERS.length; i++) {
    offers.push({
      id: i + 1,
      title: OFFERS[i],
      price: getRandomInteger(1,1000),
    });
  }
  return offers;
};

const offersArray = generateOffersArray();
const offersByType = generateOffersByType();

export { offersArray, offersByType };
