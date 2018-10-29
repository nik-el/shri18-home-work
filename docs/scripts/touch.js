var TYPE_OF_TOUCHES = {
    single: 1,
    multi: 2,
    move: 'move',
    rotate: 'rotate',
    zoom: 'zoom',
};
var BACKGROUND_SIZE = {
    max: 1000,
    min: 100,
};
var MIN_ANGLE = 2;
var MIN_DISTANCE = 80;
var FULL_CIRCLE = 360;
var HALF_OF_BRIGHTNESS = 0.5;
var RADIAN_COEFFICIENT = 57.3;
var MOVE_COEFFICIENT = 0.5;
var currentGesture = '';
var touches = [];
var currentTouches = [];
var centerOfTwoPoints;
var originalDistanceOfTwoPoints;
var touchBlock = document.querySelector('.touch-container');
touchBlock.setAttribute('touch-action', 'none');
var touchZoom = document.querySelector('.touch-container__zoom-value');
var touchBrightness = document.querySelector('.touch-container__brightness-value');
var backgroundSize = parseFloat(window.getComputedStyle(touchBlock, null).backgroundSize.trim().split(/\s+/)[0]);
touchBrightness.innerHTML = HALF_OF_BRIGHTNESS * 100 + "%";
touchZoom.innerHTML = backgroundSize / 10 + "%";
// Event pointerdown
touchBlock.addEventListener('pointerdown', function (event) {
    var backgroundPosition = window.getComputedStyle(touchBlock, null).backgroundPosition.trim().split(/\s+/);
    // for desktop
    touchBlock.setPointerCapture(event.pointerId);
    var currentTouch = {
        isPrimary: event.isPrimary,
        backgroundX: parseFloat(backgroundPosition[0]),
        coordX: event.x,
        backgroundY: parseFloat(backgroundPosition[1]),
        coordY: event.y,
    };
    // проверка на то, что primary пропал
    if (touches.length === TYPE_OF_TOUCHES.single && !touches[0].isPrimary) {
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
    }
    ;
});
// Event pointermove
touchBlock.addEventListener('pointermove', function (event) {
    // updateTouchesData(event);
    if (!touches && !touches.length) {
        return;
    }
    else if (touches.length === TYPE_OF_TOUCHES.single) {
        moveView(event);
    }
    else {
        multiTouchHandler(event, [event.x, event.y]);
    }
});
// Event pointerup
touchBlock.addEventListener('pointerup', function (event) {
    var isPrimary = event.isPrimary;
    if (touches.length === TYPE_OF_TOUCHES.single) {
        resetData();
    }
    else if (touches.length === TYPE_OF_TOUCHES.multi) {
        touches.forEach(function (touch, index) {
            if (touch.isPrimary === isPrimary) {
                touches.splice(index, 1);
            }
        });
    }
});
var moveView = function (event) {
    currentGesture = TYPE_OF_TOUCHES.move;
    var _a = touches[0], backgroundX = _a.backgroundX, coordX = _a.coordX, backgroundY = _a.backgroundY, coordY = _a.coordY;
    var x = event.x, y = event.y;
    touchBlock.style.backgroundPosition = (backgroundX - (coordX - x)) + "px " + (backgroundY - (coordY - y)) + "px";
};
var multiTouchHandler = function (event, coord) {
    if (touches.length !== TYPE_OF_TOUCHES.multi) {
        return;
    }
    var vectorA;
    var vectorB;
    if (event.isPrimary) {
        vectorA = {
            x: touches[0].coordX - centerOfTwoPoints.x,
            y: touches[0].coordY - centerOfTwoPoints.y,
        };
        vectorB = {
            x: coord[0] - centerOfTwoPoints.x,
            y: coord[1] - centerOfTwoPoints.y,
        };
    }
    else {
        vectorA = {
            x: touches[1].coordX - centerOfTwoPoints.x,
            y: touches[1].coordY - centerOfTwoPoints.y,
        };
        vectorB = {
            x: coord[0] - centerOfTwoPoints.x,
            y: coord[1] - centerOfTwoPoints.y,
        };
    }
    var angle = getAngle(vectorA, vectorB);
    var currentDistance = getDistanceTwoPoints(currentTouches[0].coordX, currentTouches[0].coordY, currentTouches[1].coordX, currentTouches[1].coordY);
    var path = currentDistance - originalDistanceOfTwoPoints;
    if (Math.abs(angle) > MIN_ANGLE && Math.abs(path) < MIN_DISTANCE && (!currentGesture || currentGesture === TYPE_OF_TOUCHES.rotate)) {
        currentGesture = TYPE_OF_TOUCHES.rotate;
        // const currentOpacity = parseInt(window.getComputedStyle(touchBlock).getPropertyValue("opacity"));
        touchBlock.style.opacity = "" + (HALF_OF_BRIGHTNESS + angle / FULL_CIRCLE);
        touchBrightness.innerHTML = (HALF_OF_BRIGHTNESS + angle / FULL_CIRCLE * 100) + "%";
    }
    else if ((!currentGesture || currentGesture === TYPE_OF_TOUCHES.zoom)) {
        currentGesture = TYPE_OF_TOUCHES.zoom;
        updateTouchesData(event);
    }
};
var resetData = function () {
    touches = [];
    currentTouches = [];
    currentGesture = '';
};
var getDistanceTwoPoints = function (ax, ay, bx, by) {
    return Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
};
var getAngle = function (vectorA, vectorB) {
    return Math.acos((vectorA.x * vectorB.x + vectorA.y * vectorB.y) / (Math.sqrt(Math.pow(vectorA.x, 2) + Math.pow(vectorA.y, 2)) * Math.sqrt(Math.pow(vectorB.x, 2) + Math.pow(vectorB.y, 2)))) * RADIAN_COEFFICIENT;
};
var updateTouchesData = function (event) {
    if (currentTouches.length < TYPE_OF_TOUCHES.multi) {
        return;
    }
    for (var _i = 0, currentTouches_1 = currentTouches; _i < currentTouches_1.length; _i++) {
        var touch = currentTouches_1[_i];
        if (event.isPrimary === touch.isPrimary) {
            touch.coordX = event.x;
            touch.coordY = event.y;
            break;
        }
    }
    var backgroundSize = parseFloat(window.getComputedStyle(touchBlock, null).backgroundSize.trim().split(/\s+/)[0]);
    var currentDistance = getDistanceTwoPoints(currentTouches[0].coordX, currentTouches[0].coordY, currentTouches[1].coordX, currentTouches[1].coordY);
    var path = currentDistance - originalDistanceOfTwoPoints;
    var currentZoom;
    if (((path) > 0 && backgroundSize < BACKGROUND_SIZE.max) ||
        ((path) < 0 && backgroundSize > BACKGROUND_SIZE.min)) {
        currentZoom = backgroundSize + path * MOVE_COEFFICIENT;
        touchBlock.style.backgroundSize = currentZoom + "px";
        touchZoom.innerHTML = currentZoom / 10 + "%";
    }
    else if (backgroundSize > BACKGROUND_SIZE.max) {
        currentZoom = BACKGROUND_SIZE.max;
        touchBlock.style.backgroundSize = currentZoom + "px";
        touchZoom.innerHTML = currentZoom / 10 + "%";
    }
    else if (backgroundSize < BACKGROUND_SIZE.min) {
        currentZoom = BACKGROUND_SIZE.min;
        touchBlock.style.backgroundSize = currentZoom + "px";
        touchZoom.innerHTML = currentZoom / 10 + "%";
    }
};
