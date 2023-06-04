import MainPresenter from './presenter/main-presenter.js';
import TravelPointModel from './model/travel-point-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import NewPointButtonView from './view/add-new-point-button-view.js';
import { render } from './framework/render.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic zxcvbnlkjhgfds';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const pageHeaderElement = document.querySelector('.page-header');
const pageMainElement = document.querySelector('.page-main');
const tripPointsContainer = pageMainElement.querySelector('.trip-events');
const tripControlsContainer = pageHeaderElement.querySelector('.trip-controls__navigation');
const tripFiltersContainer = document.querySelector('.trip-controls__filters');


const travelPointModel = new TravelPointModel(new PointsApiService(END_POINT, AUTHORIZATION));

const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(tripFiltersContainer, filterModel, travelPointModel);
const tripPresenter = new MainPresenter(tripPointsContainer, tripControlsContainer, travelPointModel, filterModel);
tripPresenter.init();

const newPointButtonComponent = new NewPointButtonView();

const closeNewPointFormHandler = () => {
  newPointButtonComponent.element.disabled = false;
};

const openNewPointFormHandler = () => {
  tripPresenter.createPoint(closeNewPointFormHandler);
  newPointButtonComponent.element.disabled = true;
};

filterPresenter.init();

travelPointModel.init().finally(() => {
  render(newPointButtonComponent, pageHeaderElement.querySelector('.trip-main'));
  newPointButtonComponent.setClickHandler(openNewPointFormHandler);
});
