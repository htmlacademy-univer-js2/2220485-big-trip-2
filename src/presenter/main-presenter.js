import TripEditView from '../view/trip-edit-view.js';
import TripEventsListView from '../view/events-list-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripEventView from '../view/trip-event-view.js';
import TripMenuView from '../view/menu-view.js';
import TripFilterView from '../view/trip-filter-view.js';
import { render } from '../render.js';

export default class MainPresenter {
  constructor(tripEventsElement,tripControlsElement) {
    this.tripEventsContainer = tripEventsElement;
    this.tripControlsContainer = tripControlsElement;
  }

  init (travelPointModel) {
    this.travelPointModel = travelPointModel;
    this.boardTravelPointModel = [...this.travelPointModel.getTravelPoints()];

    render(new TripMenuView(), this.tripControlsContainer);
    render(new TripFilterView(), this.tripControlsContainer);

    render(new TripSortView(), this.tripEventsContainer);
    render(new TripEventsListView(), this.tripEventsContainer);

    const eventsList = this.tripEventsContainer.querySelector('.trip-events__list');
    render(new TripEditView(this.boardTravelPointModel[0]), eventsList);

    for (let i = 0; i < this.boardTravelPointModel.length; i++) {
      render(new TripEventView(this.boardTravelPointModel[i]), eventsList);
    }
  }
}
