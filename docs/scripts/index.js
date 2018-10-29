var setData = function (data) {
    setTemplates(data);
};
var checkTitleLength = function (container, textContainer, text) {
    if (container.offsetHeight < textContainer.offsetHeight) {
        while (container.offsetHeight < textContainer.offsetHeight) {
            text = text.substr(0, text.length - 1);
            textContainer.innerText = text + '...';
        }
    }
};
var cutFileType = function (name, resol) {
    if (!resol) {
        return name;
    }
    var editName = name.split('.');
    editName.splice(editName.length - 1, 0, resol);
    var fullName = editName.join('.');
    return fullName;
};
var eventsContainer = document.querySelector('.events');
// set filter
var setFilter = function () {
    var defaultFilter = document.querySelector('.events__sort-filter--default');
    var denseFilter = document.querySelector('.events__sort-filter--dense');
    defaultFilter.addEventListener('click', function () {
        eventsContainer.classList.remove('events--dense');
        denseFilter.classList.remove('events__sort-filter--active');
        defaultFilter.classList.add('events__sort-filter--active');
    });
    denseFilter.addEventListener('click', function () {
        eventsContainer.classList.add('events--dense');
        denseFilter.classList.add('events__sort-filter--active');
        defaultFilter.classList.remove('events__sort-filter--active');
    });
};
// set templates
var setTemplates = function (eventsData) {
    if ('content' in document.createElement('template')) {
        var templateEventSource_1 = document.querySelector('.event-template');
        eventsData.forEach(function (event) {
            // let templateEvent : TemplateEvent;
            var eventProps = {};
            var templateEvent = templateEventSource_1.cloneNode(true);
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
            for (var eventValue in event) {
                if (eventProps[eventValue] != null) {
                    eventProps[eventValue].textContent = event[eventValue];
                }
                if (eventValue === 'size') {
                    eventProps.container.classList.add("event--" + event[eventValue]);
                    eventProps.info.classList.add("event__info--" + event[eventValue]);
                    eventProps.block.classList.add("event__block--" + event[eventValue]);
                }
                else if (eventValue === 'icon') {
                    eventProps.titleWrapper.classList.add("event__title--" + event[eventValue]);
                }
                else if (eventValue === 'type') {
                    eventProps.container.classList.add("event--" + event[eventValue]);
                    eventProps.header.classList.add("event__header--" + event[eventValue]);
                }
            }
            if (!event.data && !event.description) {
                eventProps.block.remove();
            }
            if (event.icon === 'stats') {
                eventProps.image.setAttribute('src', 'image/chart.svg');
            }
            // thermal
            if (event.icon === 'thermal' && event.data && event.data.temperature && event.data.humidity) {
                eventProps.status.innerHTML = "\n                                       <span>\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430: <span class=\"event__status-value\">" + event.data.temperature + " C</span></span>\n                                       <span>\u0412\u043B\u0430\u0436\u043D\u043E\u0441\u0442\u044C: <span class=\"event__status-value\">" + event.data.humidity + " %</span></span>\n                                      ";
            }
            else {
                eventProps.status.remove();
            }
            // set buttons
            if (event.data && event.data.buttons && event.data.buttons.length) {
                event.data.buttons.forEach(function (button) {
                    var eventButton = document.createElement('button');
                    eventButton.className = 'button event__button';
                    if (button === 'Да') {
                        eventButton.classList.add('event__button--success');
                    }
                    eventButton.innerHTML = button;
                    eventProps.actions.appendChild(eventButton);
                });
            }
            else {
                eventProps.actions.remove();
            }
            // set image
            if (event.data && event.data.image) {
                eventProps.image.setAttribute('src', "image/" + event.data.image);
                eventProps.image.setAttribute('srcset', "image/" + cutFileType(event.data.image, '@2x') + " 2x, image/" + cutFileType(event.data.image, '@3x') + " 3x");
            }
            else if (event.icon !== 'stats') {
                eventProps.image.remove();
            }
            // set music
            if (event.icon === 'music') {
                var cover = eventProps.player.querySelector('.player__cover');
                cover.setAttribute('src', "" + event.data.albumcover);
                var trackName = eventProps.player.querySelector('.player__track-text');
                // trackName.textContent = `${event.data.artist} - ${event.data.track.name}`;
            }
            else {
                eventProps.player.remove();
            }
            // set cam
            if (event.icon === 'cam') {
                eventProps.image.classList.add('event__cam');
                eventProps.cam = eventProps.image;
            }
            eventsContainer.appendChild(templateEvent.content);
            checkTitleLength(eventProps.titleWrapper, eventProps.title, eventProps.title.textContent);
            setFilter();
        });
    }
};
var getData = function () {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8000/api/events', false);
    xhr.send();
    if (xhr.status !== 200) {
        alert(xhr.status + ': ' + xhr.statusText);
    }
    else {
        setData(JSON.parse(xhr.responseText).events);
    }
};
getData();
