import { getRandomInteger } from './utils/common.js';

const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const DESTINATIONS = [
  {
    id: 1,
    description: 'Rome is Rome',
    name: 'Rome',
    pictures: [
      {
        src: `http://picsum.photos/248/152?r=${getRandomInteger(1,5)}`,
        description: 'Somewhere in Rome'
      }
    ]
  },
  {
    id: 2,
    description: 'Busan is Busan',
    name: 'Busan',
    pictures: [
      {
        src: `http://picsum.photos/248/152?r=${getRandomInteger(1,5)}`,
        description: 'Somewhere in Busan'
      }
    ]
  },
  {
    id: 3,
    description: 'Venice is Venice',
    name: 'Venice',
    pictures: [
      {
        src: `http://picsum.photos/248/152?r=${getRandomInteger(1,5)}`,
        description: 'Somewhere in Venice'
      }
    ]
  },
  {
    id: 4,
    description: 'Astana is Astana',
    name: 'Astana',
    pictures: [
      {
        src: `http://picsum.photos/248/152?r=${getRandomInteger(1,5)}`,
        description: 'Somewhere in Astana'
      }
    ]
  }
];

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past'
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export { TYPES, DESTINATIONS, FilterType, SortType };
