import Actions from './shriFlux/shriActions.js'
import Store from './shriFlux/shriStore.js';

const currentStore = Store;

currentStore.addEventChangeListener();
window.currentStore = currentStore;

const indexLink = document.querySelector('.main-nav__link--events');
const cameraLink = document.querySelector('.main-nav__link--touch');

indexLink.addEventListener('click', (event) => {
  event.stopPropagation();
  event.preventDefault();
  Actions.changeLink('index.html');
  console.log('store', currentStore);
});

cameraLink.addEventListener('click', (event) => {
  event.stopPropagation();
  event.preventDefault();
  Actions.changeLink('touch.html');
  console.log('store', currentStore);
});

