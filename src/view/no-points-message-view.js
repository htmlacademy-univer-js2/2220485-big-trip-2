import AbstractView from '../framework/view/abstract-view.js';

const createNoPointsMessageTemplate = () => `
<p class="trip-events__msg">
Click New Event to create your first point
</p>`;

export default class NoPointsMessageView extends AbstractView {
  get template() {
    return createNoPointsMessageTemplate();
  }
}
