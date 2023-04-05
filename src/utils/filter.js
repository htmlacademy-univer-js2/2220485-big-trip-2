import { FilterType } from '../consts.js';
import { isTravelPointFuture, isTravelPointPast } from './travel-point.js';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isTravelPointFuture(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isTravelPointPast(point.dateFrom, point.dateTo)),
};

