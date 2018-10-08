let eventsData = {};

fetch("./../data/events.json")
  .then(res => res.json())
  .then(data => setData(data));

const setData = (data) => {
  setTemplates(data);
};

const checkTitleLength = (container, textContainer, text) => {
  if(container.offsetHeight < textContainer.offsetHeight) {
    while(container.offsetHeight < textContainer.offsetHeight) {
      text = text.substr(0, text.length-1);
      textContainer.innerText = text + '...';
    }
  }
};

const eventsContainer = document.querySelector('.events');

//set filter
const defaultFilter = document.querySelector('.events__sort-filter--default');
const denseFilter = document.querySelector('.events__sort-filter--dense');

defaultFilter.addEventListener('click', () => {
  eventsContainer.classList.remove('events--dense');
  denseFilter.classList.remove('events__sort-filter--active');
  defaultFilter.classList.add('events__sort-filter--active');
});

denseFilter.addEventListener('click', () => {
  eventsContainer.classList.add('events--dense');
  denseFilter.classList.add('events__sort-filter--active');
  defaultFilter.classList.remove('events__sort-filter--active');
});

//set templates
const setTemplates = (data) => {
  eventsData = data;

  if ('content' in document.createElement('template')) {
    const templateEventSource = document.querySelector('.event-template');

    eventsData.events.forEach((event) => {
      const templateEvent = templateEventSource.cloneNode(true);
      let eventProps = {};
      eventProps.container = templateEvent.content.querySelector('.event');

      eventProps.header = templateEvent.content.querySelector('.event__header');
      eventProps.title = templateEvent.content.querySelector('.event__title-text');
      eventProps.titleWrapper = templateEvent.content.querySelector('.event__title');
      eventProps.info = templateEvent.content.querySelector('.event__info');
      eventProps.source = templateEvent.content.querySelector('.event__source');
      eventProps.time = templateEvent.content.querySelector('.event__time');
      eventProps.block = templateEvent.content.querySelector('.event__block');
      eventProps.description = templateEvent.content.querySelector('.event__description');
      eventProps.image = templateEvent.content.querySelector('.event__image');
      eventProps.status = templateEvent.content.querySelector('.event__status');
      eventProps.actions = templateEvent.content.querySelector('.event__actions');
      eventProps.player = templateEvent.content.querySelector('.player');

      eventProps.container.className = 'event';
      eventProps.header.className = 'event__header';

      for (const eventValue in event) {
        if (eventProps[eventValue]) {
          eventProps[eventValue].textContent = event[eventValue];
        }
        if (eventValue === 'size') {
          eventProps.container.classList.add(`event--${event[eventValue]}`);
          eventProps.info.classList.add(`event__info--${event[eventValue]}`);
          eventProps.block.classList.add(`event__block--${event[eventValue]}`);
        } else if (eventValue === 'icon') {
          eventProps.titleWrapper.classList.add(`event__title--${event[eventValue]}`);
        } else if (eventValue === 'type') {
          eventProps.container.classList.add(`event--${event[eventValue]}`);
          eventProps.header.classList.add(`event__header--${event[eventValue]}`);
        }
      }

      if (!event.data && !event.description) {
        eventProps.block.remove();
      }

      if (event.icon === 'stats') {
        eventProps.image.setAttribute('src', '../../image/chart.svg')
      }

      // thermal
      if (event.icon === 'thermal' && event.data && event.data.temperature && event.data.humidity) {
        eventProps.status.innerHTML = `
                                       <span>Температура: <span class="event__status-value">${event.data.temperature} C</span></span>
                                       <span>Влажность: <span class="event__status-value">${event.data.humidity} %</span></span>
                                      `
      } else {
        eventProps.status.remove();
      }

      //set buttons
      if (event.data && event.data.buttons && event.data.buttons.length) {
        event.data.buttons.forEach((button) => {
          const eventButton = document.createElement('button');
          eventButton.className = 'button event__button';
          if (button === 'Да') {
            eventButton.classList.add('event__button--success');
          }
          eventButton.innerHTML = button;
          eventProps.actions.appendChild(eventButton);
        })
      } else {
        eventProps.actions.remove();
      }

      //set image
      if (event.data && event.data.image) {
        eventProps.image.setAttribute('src', `../../image/${event.data.image}`)
      } else if (event.icon !== 'stats') {
        eventProps.image.remove();
      }

      //set music
      if (event.icon === 'music') {
        const cover = eventProps.player.querySelector('.player__cover');
        cover.setAttribute('src', `${event.data.albumcover}`);
        const trackName = eventProps.player.querySelector('.player__track-text');
        trackName.textContent = `${event.data.artist} - ${event.data.track.name}`;
      } else {
        eventProps.player.remove();
      }

      //set cam
      if (event.icon === 'cam') {
        eventProps.image.classList.add('event__cam');
        eventProps.cam = eventProps.image;
      }
      eventsContainer.appendChild(templateEvent.content);

      checkTitleLength(eventProps.titleWrapper, eventProps.title, eventProps.title.textContent);
    });

  }
};
