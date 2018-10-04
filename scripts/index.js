let eventsData = {};

fetch("../data/events.json")
  .then(res => res.json())
  .then(data => setData(data));

const setData = (data) => {
  setTemplates(data);
};

const setTemplates = (data) => {
  eventsData =  data

  const eventsContainer = document.querySelector('.events');

  if ('content' in document.createElement('template')) {
    const templateEventSource = document.querySelector('.event-template');

    eventsData.events.forEach((event) => {
      const templateEvent = templateEventSource.cloneNode(true);
      let eventProps = {};
      eventProps.container = templateEvent.content.querySelector('.event');

      eventProps.header = templateEvent.content.querySelector('.event__header');
      eventProps.title = templateEvent.content.querySelector('.event__title');
      eventProps.info = templateEvent.content.querySelector('.event__info');
      eventProps.source = templateEvent.content.querySelector('.event__source');
      eventProps.time = templateEvent.content.querySelector('.event__time');

      eventProps.block = templateEvent.content.querySelector('.event__block');
      eventProps.description = templateEvent.content.querySelector('.event__description');
      eventProps.image = templateEvent.content.querySelector('.event__image');

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
          eventProps.header.classList.add(`event__header--${event[eventValue]}`);
        } else if (eventValue === 'type') {
          eventProps.container.classList.add(`event--${event[eventValue]}`);
          eventProps.header.classList.add(`event__header--${event[eventValue]}`);
        }

        if (event[eventValue] === 'stats' || (event.data && event.data.image)) {
          eventProps.image.setAttribute('src', './image/chart.svg')
        }

        if (event[eventValue] === 'stats' || (event.data && event.data.image)) {
          eventProps.image.setAttribute('src', `./image/${event.data.image}`)
        } else {
          eventProps.image.remove();
        }

        if (!event.data && !event.description) {
          eventProps.block.remove();
        }
      }

      // const cloneEvent = document.importNode(templateEvent.content, true);
      eventsContainer.appendChild(templateEvent.content);
    });

  }
};


