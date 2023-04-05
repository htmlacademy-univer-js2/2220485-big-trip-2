import { getRandomInteger } from './utils/common.js';

const TYPES = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

const OFFERS = ['Add luggage', 'Switch to comfort class', 'Add meal', 'Rent a car', 'Add breakfast'];

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

export { TYPES, OFFERS, DESTINATIONS, FilterType };
