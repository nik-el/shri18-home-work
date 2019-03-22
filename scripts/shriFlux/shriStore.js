import { BasicStore } from '../basicFlux/basicFlux.js';
import dispatcher from './shriDispatcher.js';

class ShriStore extends BasicStore {
  constructor () {
    super();
    this.link = '';
    getLink().then((data) => {
      this.link = data.lastLink || 'index.html';
      if (window.location.pathname === '/') {
        window.location.href = this.link;
      }
    });

    dispatcher.register(commit => {
      switch (commit.type) {
        case 'CHANGE_LINK':
          this.changeLinkCommit(commit.payload);
          this.dispatchChangeEvent();
          break;
        default:
          break;
      }
    });
  }

  changeLinkCommit (payload) {
    console.log('changeLinkCommit');
    this.link = payload;
    saveLink(this.link);
  }

  getStoreLink () {
    return this.link;
  }
}

const getLink = () => {
  return fetch('http://localhost:8000/api/link/read', { method: 'POST' })
    .then((response) => {
      return response.json();
    }).then((json) => {
      console.log('json::', json);
      return json;
    }).catch(() => {
      throw new Error('Ошибка получения данных');
    });
};

const saveLink = (link) => {
  return fetch(`http://localhost:8000/api/link/save?link=${link}`, { method: 'POST' })
    .catch(() => {
      throw new Error('Ошибка сохранения данных');
    });
};

const Store = new ShriStore();
export default Store;
