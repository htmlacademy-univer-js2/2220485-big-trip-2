import { FilterType } from '../consts.js';
import AbstractView from '../framework/view/abstract-view.js';

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now'
};

const createNoPointsMessageTemplate = (filterType) => {
  const noPointTextValue = NoPointsTextType[filterType];

  return (
    `<p class="trip-events__msg">
      ${noPointTextValue}
    </p>`);
};

export default class NoPointsMessageView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointsMessageTemplate(this.#filterType);
  }
}
