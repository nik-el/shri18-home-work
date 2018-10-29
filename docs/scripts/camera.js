var MAGIC_VOLUME_COEFFICIENT = 22;
var initVideo = function (video, url) {
    console.log('Hls.isSupported', Hls.isSupported);
    if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
        });
    }
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('loadedmetadata', function () {
            video.play();
        });
    }
};
var requestId;
var context = new (window.AudioContext || window.webkitAudioContext)();
var analyser = context.createAnalyser();
var destination = context.destination;
analyser.fftSize = 128;
var bTimeData = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteTimeDomainData(bTimeData);
analyser.connect(destination);
var modal = document.querySelector('.modal');
var modalControls = document.querySelector('.modal__controls');
var modalReturn = document.querySelector('.modal__button--return');
var modalContrast = document.querySelector('.modal__contrast');
var modalBrightness = document.querySelector('.modal__brightness');
var volumeModal = document.querySelector('.modal__volume');
var cameras = document.querySelectorAll('.camera');
var openModal = function (id) {
    var currentVideo = document.getElementById("video-" + id);
    modal.insertBefore(currentVideo, modalControls);
    currentVideo.play();
    currentVideo.setAttribute('controls', '');
    currentVideo.muted = false;
    initSettings('contrast', currentVideo);
    initSettings('brightness', currentVideo);
    modal.classList.add('modal--show');
};
var getVolume = function (data) {
    var values = 0;
    data.forEach(function (value) {
        values += value;
    });
    var average = values / data.length;
    return average;
};
var closeModal = function () {
    var currentVideo = document.querySelector('.modal .camera__video');
    var id = currentVideo.dataset.id;
    var camera = document.querySelector(".camera--" + id);
    camera.appendChild(currentVideo);
    currentVideo.play();
    currentVideo.muted = true;
    currentVideo.removeAttribute('controls');
    modal.classList.remove('modal--show');
    cancelAnimationFrame(requestId);
};
modalContrast.addEventListener('input', function (event) {
    changeSettings(parseInt(modalContrast.value), 'contrast');
});
modalBrightness.addEventListener('input', function (event) {
    changeSettings(parseInt(modalContrast.value), 'brightness');
});
var initSettings = function (filter, currentVideo) {
    var currentFilters = currentVideo.style.filter.split(' ');
    currentFilters.forEach(function (currentFilter) {
        if (currentFilter.split('(')[0] === filter) {
            if (filter === 'contrast') {
                var valueTitle = document.querySelector(".modal__" + filter + "-value");
                var value = parseInt(currentFilter.split('(').pop().split('%')[0]);
                valueTitle.innerText = (filter + ": " + value * 2 + "%");
            }
            else if (filter === 'brightness') {
                var valueTitle = document.querySelector(".modal__" + filter + "-value");
                var value = parseInt(currentFilter.split('(').pop().split('%')[0]);
                valueTitle.innerText = filter + ": " + value * 2 + "%";
            }
        }
    });
    currentVideo.style.filter = currentFilters.join(' ');
};
var changeSettings = function (value, filter) {
    var valueTitle = document.querySelector(".modal__" + filter + "-value");
    var currentVideo = document.querySelector('.modal .camera__video');
    var currentFilters = currentVideo.style.filter.split(' ');
    currentFilters.forEach(function (currentFilter, index) {
        if (currentFilter.split('(')[0] === filter) {
            currentFilters[index] = filter + "(" + value * 2 + "%)";
        }
    });
    currentVideo.style.filter = currentFilters.join(' ');
    valueTitle.innerText = filter + ": " + value * 2 + "%";
};
cameras.forEach(function (camera) {
    var video = camera.querySelector('.camera__video');
    var source = context.createMediaElementSource(video);
    source.connect(analyser);
    var showVolume = function () {
        analyser.getByteTimeDomainData(bTimeData);
        var volume = (128 - getVolume(bTimeData)) * MAGIC_VOLUME_COEFFICIENT;
        volumeModal.style.width = volume.toFixed(4) + '%';
        requestId = requestAnimationFrame(showVolume);
    };
    camera.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        openModal(event.target.dataset.id);
        showVolume();
    });
});
modalReturn.addEventListener('click', function () {
    closeModal();
});
window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal.classList.contains('modal--show')) {
        closeModal();
    }
});
initVideo(document.getElementById('video-1'), 'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8');
initVideo(document.getElementById('video-2'), 'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8');
initVideo(document.getElementById('video-3'), 'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8');
initVideo(document.getElementById('video-4'), 'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8');
