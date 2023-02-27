import TripMenuView from './view/menu-view.js';
import TripFilterView from './view/trip-filter-view.js';
import { render } from './render.js';
import EventsPresenter from './presenter/eventsPresenter.js';

const pageHeader = document.querySelector('.page-header');
const pageMain = document.querySelector('.page-main');
const menuElement = pageHeader.querySelector('.trip-controls__navigation');
const filterElement = pageHeader.querySelector('.trip-controls__filters');
const tripEvents = pageMain.querySelector('.trip-events');

render(new TripMenuView(), menuElement);
render(new TripFilterView(), filterElement);

const tripPresenter = new EventsPresenter();

tripPresenter.init(tripEvents);
