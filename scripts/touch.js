const TYPE_OF_TOUCHES = {
  single: 1,
  multi: 2,
  move: 'move',
  rotate: 'rotate',
  zoom: 'zoom',
};
const BACKGROUND_SIZE = {
  max: 1000,
  min: 100,
};
const MIN_ANGLE = 2;
const MIN_DISTANCE = 80;
const FULL_CIRCLE = 360;
const HALF_OF_BRIGHTNESS = 0.5;
const RADIAN_COEFFICIENT = 57.3;
const MOVE_COEFFICIENT = 0.5;

let currentGesture = '';
let touches = [];
let currentTouches = [];
let centerOfTwoPoints = null;
let originalDistanceOfTwoPoints = null;

const touchBlock = document.querySelector('.touch-container');
touchBlock.setAttribute('touch-action', 'none');

const touchZoom = document.querySelector('.touch-container__zoom-value');
const touchBrightness = document.querySelector('.touch-container__brightness-value');
const backgroundSize = parseFloat(window.getComputedStyle(touchBlock,null).backgroundSize.trim().split(/\s+/)[0]);

touchBrightness.innerHTML = `${HALF_OF_BRIGHTNESS * 100}%`;
touchZoom.innerHTML = `${backgroundSize / 10}%`;

// Event pointerdown
touchBlock.addEventListener('pointerdown', (event) => {
  const backgroundPosition = window.getComputedStyle(touchBlock,null).backgroundPosition.trim().split(/\s+/);

  // for desktop
  touchBlock.setPointerCapture(event.pointerId);

  const currentTouch = {
    isPrimary: event.isPrimary,
    backgroundX: parseFloat(backgroundPosition[0]),
    coordX: event.x,
    backgroundY: parseFloat(backgroundPosition[1]),
    coordY: event.y,
  };

  // проверка на то, что primary пропал
  if (touches.length === TYPE_OF_TOUCHES.single && !touches[0].isPrimary) {
    console.warn('СКИДЫВАЮ');
    touches = [];
    return;
  }

  touches.push(currentTouch);

  if (touches.length === TYPE_OF_TOUCHES.multi) {
    currentTouches = JSON.parse(JSON.stringify(touches));
    centerOfTwoPoints = {
      x: (touches[0].coordX + touches[1].coordX) / 2,
      y: (touches[0].coordY + touches[1].coordY) / 2
    };
    originalDistanceOfTwoPoints = getDistanceTwoPoints(touches[0].coordX, touches[0].coordY, touches[1].coordX, touches[1].coordY);
  };
});

// Event pointermove
touchBlock.addEventListener('pointermove', (event) => {
  // updateTouchesData(event);
  if (!touches && !touches.length) {
    return;
  } else if (touches.length === TYPE_OF_TOUCHES.single) {
    moveView();
  } else {
    multiTouchHandler(event, event.isPrimary , [event.x, event.y]);
  }
});

// Event pointerup
touchBlock.addEventListener('pointerup', (event) => {
  if (touches.length === TYPE_OF_TOUCHES.single) {
    resetData();
  } else if (touches.length === TYPE_OF_TOUCHES.multi) {
    touches.forEach((touch, index) => {
      if (touch.isPrimary === event.isPrimary) {
        touches.splice(index, 1);
      }
    })
  }
});

const moveView = () => {
  currentGesture = TYPE_OF_TOUCHES.move;
  const {backgroundX, coordX, backgroundY, coordY} = touches[0];
  const {x, y} = event;

  touchBlock.style.backgroundPosition = `${(backgroundX - (coordX - x))}px ${(backgroundY - (coordY - y))}px`;
};

const multiTouchHandler = (event, isPrimary, coord) => {
  if (touches.length !== TYPE_OF_TOUCHES.multi) {
    return
  }

  let vectorA = null;
  let vectorB = null;

  if (isPrimary) {
    vectorA = {
      x: touches[0].coordX - centerOfTwoPoints.x,
      y: touches[0].coordY - centerOfTwoPoints.y,
    };
    vectorB = {
      x: coord[0] - centerOfTwoPoints.x,
      y: coord[1] - centerOfTwoPoints.y,
    }
  } else {
    vectorA = {
      x: touches[1].coordX - centerOfTwoPoints.x,
      y: touches[1].coordY - centerOfTwoPoints.y,
    };
    vectorB = {
      x: coord[0] - centerOfTwoPoints.x,
      y: coord[1] - centerOfTwoPoints.y,
    }
  }

  const angle = getAngle(vectorA, vectorB);
  const currentDistance = getDistanceTwoPoints(currentTouches[0].coordX, currentTouches[0].coordY, currentTouches[1].coordX, currentTouches[1].coordY);
  const path = currentDistance - originalDistanceOfTwoPoints;

  if (Math.abs(angle) > MIN_ANGLE && Math.abs(path) < MIN_DISTANCE && (!currentGesture || currentGesture === TYPE_OF_TOUCHES.rotate)) {
    currentGesture = TYPE_OF_TOUCHES.rotate;
    // const currentOpacity = parseInt(window.getComputedStyle(touchBlock).getPropertyValue("opacity"));

    touchBlock.style.opacity = `${HALF_OF_BRIGHTNESS + angle/FULL_CIRCLE}`;
    touchBrightness.innerHTML = `${parseInt((HALF_OF_BRIGHTNESS + angle/FULL_CIRCLE) * 100)}%`;

  } else if((!currentGesture || currentGesture === TYPE_OF_TOUCHES.zoom)) {
    currentGesture = TYPE_OF_TOUCHES.zoom;
    updateTouchesData(event);
  }
};

const resetData = () => {
  touches = [];
  currentTouches = [];
  currentGesture = '';
};

const getDistanceTwoPoints = (ax, ay, bx, by) => {
  return Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
};

const getAngle = (vectorA, vectorB) => {
  return Math.acos((vectorA.x * vectorB.x + vectorA.y * vectorB.y) / (Math.sqrt(Math.pow(vectorA.x, 2) + Math.pow(vectorA.y, 2)) * Math.sqrt(Math.pow(vectorB.x, 2) + Math.pow(vectorB.y, 2)))) * RADIAN_COEFFICIENT;
};

const updateTouchesData = (event) => {
  if (currentTouches.length < TYPE_OF_TOUCHES.multi) {
    return
  }
  for (const touch of currentTouches) {
    if (event.isPrimary === touch.isPrimary) {
      touch.coordX = event.x;
      touch.coordY = event.y;
      break
    }
  }
  const backgroundSize = parseFloat(window.getComputedStyle(touchBlock,null).backgroundSize.trim().split(/\s+/)[0]);
  const currentDistance = getDistanceTwoPoints(currentTouches[0].coordX, currentTouches[0].coordY, currentTouches[1].coordX, currentTouches[1].coordY);
  const path = currentDistance - originalDistanceOfTwoPoints;

  let currentZoom;
  if (((path) > 0 && backgroundSize < BACKGROUND_SIZE.max) ||
     ((path) < 0 && backgroundSize > BACKGROUND_SIZE.min))
  {
    currentZoom = backgroundSize + path * MOVE_COEFFICIENT;
    touchBlock.style.backgroundSize = `${currentZoom}px`;
    touchZoom.innerHTML = `${parseInt(currentZoom / 10)}%`;
  } else if (backgroundSize > BACKGROUND_SIZE.max) {
    currentZoom = BACKGROUND_SIZE.max;
    touchBlock.style.backgroundSize = `${currentZoom}px`
    touchZoom.innerHTML = `${parseInt(currentZoom / 10)}%`;
  } else if (backgroundSize < BACKGROUND_SIZE.min) {
    currentZoom = BACKGROUND_SIZE.min;
    touchBlock.style.backgroundSize = `${currentZoom}px`
    touchZoom.innerHTML = `${parseInt(currentZoom / 10)}%`;
  }
};
