import dayjs from 'dayjs';

export const duration = (dateFrom, dateTo) => {
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);
  const difference = end.diff(start, 'minute');

  const days = Math.floor(difference / 1440);
  const restHours = Math.floor((difference - days * 1440) / 60);
  const restMinutes = difference - (days * 1440 + restHours * 60);

  const daysOutput = (days) ? `${days}D` : '';
  const hoursOutput = (restHours) ? `${restHours}H` : '';
  const minutesOutput = (restMinutes) ? `${restMinutes}M` : '';

  return `${daysOutput} ${hoursOutput} ${minutesOutput}`;
};

export const isTravelPointsNow = (dateFrom, dateTo) => dateFrom.isBefore(dayjs()) && dateTo.isAfter(dayjs());
export const isTravelPointFuture = (dateFrom, dateTo) => dateFrom.isAfter(dayjs()) || isTravelPointsNow(dateFrom, dateTo);
export const isTravelPointPast = (dateFrom, dateTo) => dateTo.isBefore(dayjs()) || isTravelPointsNow(dateFrom, dateTo);

