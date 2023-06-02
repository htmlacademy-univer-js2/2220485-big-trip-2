import dayjs from 'dayjs';

const getDaysOutput = (days) => days <= 0 ? '' : `${`${days}`.padStart(2, '0')}D`;
const getHoursOutput = (days, restHours) => (days <= 0 && restHours <= 0) ? '' : `${`${restHours}`.padStart(2, '0')}H`;
const getMinutesOutput = (restMinutes) => `${`${restMinutes}`.padStart(2,'0')}M`;

export const duration = (dateFrom, dateTo) => {
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);
  const difference = end.diff(start, 'minute');

  const days = Math.floor(difference / 1440);
  const restHours = Math.floor((difference - days * 1440) / 60);
  const restMinutes = difference - (days * 1440 + restHours * 60);

  const daysOutput = getDaysOutput(days);
  const hoursOutput = getHoursOutput(days, restHours);
  const minutesOutput = getMinutesOutput(restMinutes);

  return `${daysOutput} ${hoursOutput} ${minutesOutput}`;
};

export const isTravelPointsBoth = (dateFrom, dateTo) =>  dayjs().diff(dateFrom, 'minute') > 0 && dayjs().diff(dateTo, 'minute') < 0;
export const isTravelPointFuture = (dateFrom, dateTo) => dayjs().diff(dateFrom, 'minute') <= 0 || isTravelPointsBoth(dateFrom, dateTo);
export const isTravelPointPast = (dateFrom, dateTo) => dayjs().diff(dateTo, 'minute') > 0 || isTravelPointsBoth(dateFrom, dateTo);

export const sortByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const sortByDuration = (pointA, pointB) => {
  const durationPointA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationPointB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationPointB - durationPointA;
};

export const sortByDay = (pointA, pointB) => dayjs(pointA.dateFrom) - dayjs(pointB.dateFrom);
