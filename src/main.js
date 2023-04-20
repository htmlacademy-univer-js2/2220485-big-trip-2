import MainPresenter from './presenter/main-presenter.js';
import TravelPointModel from './model/travel-point-model.js';
import { getTravelPoints, getOffersByType } from './mock/travel-point.js';

const pageHeaderElement = document.querySelector('.page-header');
const pageMainElement = document.querySelector('.page-main');
const tripEventsContainer = pageMainElement.querySelector('.trip-events');
const tripControlsContainer = pageHeaderElement.querySelector('.trip-controls__navigation');
const tripFiltersContainer = document.querySelector('.trip-controls__filters');


const points = getTravelPoints();
const offers = getOffersByType();

const travelPointModel = new TravelPointModel();
travelPointModel.init(points, offers);

const tripPresenter = new MainPresenter(tripEventsContainer, tripControlsContainer, tripFiltersContainer, travelPointModel);

tripPresenter.init();
