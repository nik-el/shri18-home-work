const MAGIC_VOLUME_COEFFICIENT = 22;

const initVideo = (video, url) => {
  console.log('Hls.isSupported', Hls.isSupported);
  if (Hls.isSupported()) {
    var hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play();
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
    video.addEventListener('loadedmetadata', function () {
      video.play();
    });
  }
};
let requestId;

const context = new (window.AudioContext || window.webkitAudioContext)();
const analyser = context.createAnalyser();
const destination = context.destination;

analyser.fftSize = 128;
const bTimeData = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteTimeDomainData(bTimeData);
analyser.connect(destination);

const modal = document.querySelector('.modal');
const modalControls = document.querySelector('.modal__controls');
const modalReturn = document.querySelector('.modal__button--return');
const modalContrast = document.querySelector('.modal__contrast');
const modalBrightness = document.querySelector('.modal__brightness');
const volumeModal = document.querySelector('.modal__volume');

const cameras = document.querySelectorAll('.camera');

const openModal = (id) => {
  const currentVideo = document.getElementById(`video-${id}`);
  modal.insertBefore(currentVideo, modalControls);
  currentVideo.play();
  currentVideo.setAttribute('controls', '');
  currentVideo.muted = false;
  initSettings('contrast', currentVideo);
  initSettings('brightness', currentVideo);

  modal.classList.add('modal--show');
};

const getVolume = (data) => {
  let values = 0;
  data.forEach((value) => {
    values += value;
  });

  const average = values / data.length;
  return average;
};

const closeModal = () => {
  const currentVideo = document.querySelector('.modal .camera__video');
  const id = currentVideo.dataset.id;
  const camera = document.querySelector(`.camera--${id}`);
  camera.appendChild(currentVideo);
  currentVideo.play();
  currentVideo.muted = true;
  currentVideo.removeAttribute('controls');
  modal.classList.remove('modal--show');

  cancelAnimationFrame(requestId);
};

modalContrast.addEventListener('input', (event) => {
  changeSettings(event.target.value, 'contrast');
});
modalBrightness.addEventListener('input', (event) => {
  changeSettings(event.target.value, 'brightness');
});

const initSettings = (filter, currentVideo) => {

  const currentFilters = currentVideo.style.filter.split(' ');
  currentFilters.forEach((currentFilter) => {
    if (currentFilter.split('(')[0] === filter) {
      if (filter === 'contrast') {
        const valueTitle = document.querySelector(`.modal__${filter}-value`);
        modalContrast.value = currentFilter.split('(').pop().split('%')[0] / 2;
        valueTitle.innerText = `${filter}: ${modalContrast.value*2}%`;
      } else if (filter === 'brightness') {
        const valueTitle = document.querySelector(`.modal__${filter}-value`);
        modalBrightness.value = currentFilter.split('(').pop().split('%')[0] / 2;
        valueTitle.innerText = `${filter}: ${modalBrightness.value*2}%`;
      }
    }
  });

  currentVideo.style.filter = currentFilters.join(' ');
};

const changeSettings = (value, filter) => {
  const valueTitle = document.querySelector(`.modal__${filter}-value`);
  const currentVideo = document.querySelector('.modal .camera__video');
  const currentFilters = currentVideo.style.filter.split(' ');
  currentFilters.forEach((currentFilter, index) => {
    if (currentFilter.split('(')[0] === filter) {
      currentFilters[index] = `${filter}(${value*2}%)`;
    }
  });

  currentVideo.style.filter = currentFilters.join(' ');
  valueTitle.innerText = `${filter}: ${value*2}%`;
};

cameras.forEach(camera => {
  const video = camera.querySelector('.camera__video');
  const source = context.createMediaElementSource(video);
  source.connect(analyser);
  const showVolume = () => {
    analyser.getByteTimeDomainData(bTimeData);
    let volume = (128 - getVolume(bTimeData)) * MAGIC_VOLUME_COEFFICIENT;
    volumeModal.style.width = volume.toFixed(4) + '%';
    requestId = requestAnimationFrame(showVolume);
  };

  camera.addEventListener('click', (event) => {
    openModal(event.target.dataset.id);
    showVolume(event.target.dataset.id);
  });
});

modalReturn.addEventListener('click', () => {
  closeModal();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains('modal--show')) {
    closeModal();
  }
});

initVideo(
  document.getElementById('video-1'),
  'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8'
);

initVideo(
  document.getElementById('video-2'),
  'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8'
);

initVideo(
  document.getElementById('video-3'),
  'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8'
);

initVideo(
  document.getElementById('video-4'),
  'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8'
);

