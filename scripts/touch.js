const touchBlock = document.querySelector('.touch-container');
let currentGesture = null;

touchBlock.setAttribute('touch-action', 'none');

touchBlock.addEventListener('pointerdown', (event) => {
  const position = window.getComputedStyle(touchBlock,null).backgroundPosition.trim().split(/\s+/);

  touchBlock.setPointerCapture(event.pointerId);

  currentGesture = {
    startX: parseFloat(position[0]),
    prevX: event.x,
    startY: parseFloat(position[1]),
    prevY: event.y,
  };
});

touchBlock.addEventListener('pointermove', (event) => {
  if (!currentGesture) {
    return;
  }

  moveView();
});

touchBlock.addEventListener('pointerup', (event) => {
  currentGesture = null;
});

const moveView = () => {
  const {startX, prevX, startY, prevY} = currentGesture;
  const {x, y} = event;

  touchBlock.style.backgroundPosition = `${(startX - (prevX - x))}px ${(startY - (prevY - y))}px`;
};
