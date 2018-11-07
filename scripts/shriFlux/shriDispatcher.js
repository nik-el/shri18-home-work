import { BasicDispatcher } from '../basicFlux/basicFlux.js';

class Dispatcher extends BasicDispatcher {
  changeLink (link) {
    const action = {
      type: 'CHANGE_LINK',
      payload: link
    };
    this.dispatch(action);
  }
}

const dispatcher = new Dispatcher();
export default dispatcher;
