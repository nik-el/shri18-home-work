class BasicDispatcher {
  constructor () {
    this._id = 0;
    this._callbacks = {};
  }

  register (callback) {
    const id = 'id' + this._id++;
    this._callbacks[id] = callback;
  }

  dispatch (action) {
    for (const id in this._callbacks) {
      if (this._callbacks.hasOwnProperty(id)) {
        this._callbacks[id](action);
      }
    }
  }
}

class BasicStore {
  addEventChangeListener (callback) {
    document.addEventListener('change', callback);
  }

  dispatchChangeEvent () {
    const changeEvent = new Event('change');
    document.dispatchEvent(changeEvent);
  }
}

export { BasicDispatcher, BasicStore }
