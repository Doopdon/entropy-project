// Configuration constants
const width = 600;
const height = 300;
const pxSize = 2;

const mateerial1SpecificHeat = 1;
const mateerial2SpecificHeat = 1;

const colorMap = [
    '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#843b62',
    '#f9c74f', '#90be6d', '#f94144', '#577590', '#f3722c'
];

// Global state variables
let speedValue = 1;
let roomTemp = 0;
let mode = 'atomic';

// Grid arrays
let valueGrid;
let materialGrid = [];

// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = width * pxSize;
canvas.height = height * pxSize;

// Initialize value grid with room temperature
function setGrid() {
    valueGrid = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => roomTemp)
    );
}

// Create material grid with different heat conductivity zones
function makeMaterialGrid() {
    // Center coordinates
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);

    // Square bounds (50x50 centered)
    const squareSize = 50;
    const half = squareSize / 2;

    for (let y = 0; y < height; y++) {
        materialGrid[y] = [];
        for (let x = 0; x < width; x++) {
            // Default value
            materialGrid[y][x] = mateerial1SpecificHeat;

            // If within vertical strip centered on grid
            if (x >= centerX - half && x < centerX + half) {
                materialGrid[y][x] = mateerial2SpecificHeat;
            }
        }
    }
}

// Color mapping functions
function getColorForValue(val) {
    if (val == 0) {
        return '#000000';
    }
    return colorMap[val % 10];
}

function getTemperatureColorForValue(value, material) {
    // Clamp 0–1000
    value = Math.max(0, Math.min(1000, value));

    // Invert and normalize
    const t = Math.pow(value / 1000, 0.5);

    // Scale red down, green and blue stay 0
    const r = Math.floor(255 * t);
    return `rgb(${r}, 0, 0)`;
}

// Drawing function
function drawPixel(x, y, val, material) {
    if (mode == 'atomic') {
        ctx.fillStyle = getColorForValue(val);
        ctx.fillRect(x * pxSize, y * pxSize, pxSize, pxSize);
    } else if (mode == 'temp') {
        ctx.fillStyle = getTemperatureColorForValue(val, material);
        ctx.fillRect(x * pxSize, y * pxSize, pxSize, pxSize);
    }
}

// Initialize grids
function initializeSimulation() {
    setGrid();
    makeMaterialGrid();
}

// Initialize the simulation
initializeSimulation();
