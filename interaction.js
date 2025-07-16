// Mouse interaction state
let isMouseDown = false;

// Mouse event handlers for painting heat
canvas.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    paintAtMouse(e);
});

canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
});

canvas.addEventListener('mouseleave', () => {
    isMouseDown = false; // stop if mouse leaves canvas
});

canvas.addEventListener('mousemove', (e) => {
    if (isMouseDown) {
        paintAtMouse(e);
    }
});

// Paint heat at mouse position
function paintAtMouse(e) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pxSize);
    const y = Math.floor((e.clientY - rect.top) / pxSize);

    if (x >= 0 && x < width && y >= 0 && y < height) {
        const newVal = 1000;
        valueGrid[y][x] = newVal;
        drawPixel(x, y, newVal);
    }
}

// Speed control UI
const display = document.getElementById('speedValue');
const updateDisplay = () => {
    display.textContent = speedValue;
};

document.getElementById('speedUp').addEventListener('click', () => {
    speedValue++;
    updateDisplay();
});

document.getElementById('speedDown').addEventListener('click', () => {
    speedValue--;
    updateDisplay();
});

// Room temperature control
const roomTempInput = document.getElementById('roomTempInput');

// Update JS variable when user types
roomTempInput.addEventListener('input', () => {
    roomTemp = parseInt(roomTempInput.value) || 0;
    console.log('roomTemp =', roomTemp);
});

// Reset button - reinitialize the grid
document.getElementById('reset').addEventListener('click', () => {
    setGrid();
});

// Display mode buttons
document.getElementById('temp').addEventListener('click', () => {
    mode = 'temp';
});

document.getElementById('atomic').addEventListener('click', () => {
    mode = 'atomic';
});
