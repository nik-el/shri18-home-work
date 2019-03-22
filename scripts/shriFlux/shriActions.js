import dispatcher from './shriDispatcher.js';

class Actions {
  static changeLink (link) {
    dispatcher.changeLink(link);
  }
}

export default Actions;
