import { filter } from '../utils/filter.js';

export const generateFilter = (travelPoints) => Object.entries(filter).map(
  ([filterName, filterPoints]) => ({
    name: filterName,
    count: filterPoints(travelPoints).length
  }),
);
