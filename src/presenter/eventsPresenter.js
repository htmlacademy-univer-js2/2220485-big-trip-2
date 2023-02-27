import TripEditView from '../view/trip-edit-view.js';
import TripEventsListView from '../view/events-list-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripEventView from '../view/trip-event-view.js';
import { render } from '../render.js';

export default class EventsPresenter {
  init (tripEventsContainer) {
    this.tripEventsContainer = tripEventsContainer;

    render(new TripSortView(), this.tripEventsContainer);
    render(new TripEventsListView(), this.tripEventsContainer);

    const eventsList = tripEventsContainer.querySelector('.trip-events__list');
    render(new TripEditView(), eventsList);

    for (let i = 0; i < 3; i++) {
      render(new TripEventView, eventsList);
    }
  }
}
