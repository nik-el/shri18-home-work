let eventsData = {};

fetch("../data/events.json")
  .then(res => res.json())
  .then(data => setData(data));

const setData = (data) => {
  setTemplates(data);
};

const setTemplates = (data) => {
  eventsData =  data;

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
      eventProps.status = templateEvent.content.querySelector('.event__status');
      eventProps.actions = templateEvent.content.querySelector('.event__actions');

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



      }
      if (!event.data && !event.description) {
        eventProps.block.remove();
      }

      if (event.icon === 'stats') {
        eventProps.image.setAttribute('src', './image/chart.svg')
      } else if (event.icon === 'thermal' && event.data && event.data.temperature && event.data.humidity) {
        eventProps.status.innerHTML = `
                                         Температура: <span class="event__status-value">${event.data.temperature} C</span>
                                         Влажность: <span class="event__status-value">${event.data.humidity} %</span>
                                        `
      } else if (event.data && event.data.buttons && event.data.buttons.length) {
        event.data.buttons.forEach((button, index) => {
          const eventButton = document.createElement('button');
          eventButton.className = 'button event__button';
          if (button === 'Да') {
            eventButton.classList.add('event__button--success');
          }
          eventButton.innerHTML = button;
          eventProps.actions.appendChild(eventButton);
        })
      }


      if (event.data && event.data.image) {
        eventProps.image.setAttribute('src', `./image/${event.data.image}`)
      } else if (event.icon !== 'stats') {
        eventProps.image.remove();
      }



      eventsContainer.appendChild(templateEvent.content);
    });

  }
};


