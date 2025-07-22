// Configuration constants
const width = 300;
const height = 300;
const pxSize = 2;


const colorMap = [
    '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#843b62',
    '#f9c74f', '#90be6d', '#f94144', '#577590', '#f3722c'
];

// Global state variables
let speedValue = 0;
let roomTemp = 0;
let mode = 'atomic';

// Grid arrays
let temperatureGrid;

let materialGrid;

// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = width * pxSize;
canvas.height = height * pxSize;

// Initialize value grid with room temperature
function setTemperatureGrid() {
    temperatureGrid = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => roomTemp)
    );
}

function setMaterialGrid() {
    const middleRow = Math.floor(height / 2);

    materialGrid = Array.from({ length: height }, (_, row) =>
        Array.from({ length: width }, () => (0))
    );
}


// Color mapping functions
function getColorForValue(val) {
    if (val == 0) {
        return '#000000';
    }
    return colorMap[val % 10];
}

function getTemperatureColorForValue(value) {
    // Clamp 0–1000
    value = Math.max(0, Math.min(1000, value));

    // Invert and normalize
    const t = Math.pow(value / 1000, 0.5);

    // Scale red down, green and blue stay 0
    const r = Math.floor(255 * t);
    return `rgb(${r}, 0, 0)`;
}

function getMaterialColor(val) {
    return [' #000000', '#FFFFFF'][val];
}

// Drawing function
function drawPixel(x, y, val) {
    if (val == -1) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x * pxSize, y * pxSize, pxSize, pxSize);
    }
    if (mode == 'atomic') {
        ctx.fillStyle = getColorForValue(val);
        ctx.fillRect(x * pxSize, y * pxSize, pxSize, pxSize);
    } else if (mode == 'temp') {
        ctx.fillStyle = getTemperatureColorForValue(val);
        ctx.fillRect(x * pxSize, y * pxSize, pxSize, pxSize);
    } else if (mode == 'material') {
        ctx.fillStyle = getMaterialColor(materialGrid[y][x]);
        ctx.fillRect(x * pxSize, y * pxSize, pxSize, pxSize);
    }
}

// Initialize the simulation
setTemperatureGrid();
setMaterialGrid();