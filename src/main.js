import MainPresenter from './presenter/main-presenter.js';

import TravelPointModel from './model/travel-point-model.js';

const pageHeaderElement = document.querySelector('.page-header');
const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');
const tripControlsElement = pageHeaderElement.querySelector('.trip-controls');

const travelPointModel = new TravelPointModel();
const tripPresenter = new MainPresenter(tripEventsElement, tripControlsElement);

tripPresenter.init(travelPointModel);
