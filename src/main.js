import MainPresenter from './presenter/main-presenter.js';
import TravelPointModel from './model/travel-point-model.js';
import { getTravelPoints, getOffersByType } from './mock/travel-point.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import NewPointButtonView from './view/add-new-point-button-view.js';
import { render } from './framework/render.js';

const pageHeaderElement = document.querySelector('.page-header');
const pageMainElement = document.querySelector('.page-main');
const tripEventsContainer = pageMainElement.querySelector('.trip-events');
const tripControlsContainer = pageHeaderElement.querySelector('.trip-controls__navigation');
const tripFiltersContainer = document.querySelector('.trip-controls__filters');


const points = getTravelPoints();
const offers = getOffersByType();

const travelPointModel = new TravelPointModel();
travelPointModel.init(points, offers);

const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(tripFiltersContainer, filterModel, travelPointModel);
const tripPresenter = new MainPresenter(tripEventsContainer, tripControlsContainer, travelPointModel, filterModel);
tripPresenter.init();

const newPointButtonComponent = new NewPointButtonView();

const closeNewEventFormHandler = () => {
  newPointButtonComponent.element.disabled = false;
};

const openNewEventFormHandler = () => {
  tripPresenter.createPoint(closeNewEventFormHandler);
  newPointButtonComponent.element.disabled = true;
};

render(newPointButtonComponent, pageHeaderElement.querySelector('.trip-main'));
newPointButtonComponent.setClickHandler(openNewEventFormHandler);

filterPresenter.init();
