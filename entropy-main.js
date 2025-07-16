const width = 600;
const height = 300;
const pxSize = 2;

const mateerial1SpecificHeat = 1;
const mateerial2SpecificHeat = 1;

const colorMap = [
    '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#843b62',
    '#f9c74f', '#90be6d', '#f94144', '#577590', '#f3722c'
];

let speedValue = 1;
let roomTemp = 0;

function randomValue() {
    return Math.floor(Math.random() * 1000) + 1;
}
let valueGrid;
function setGrid() {
    valueGrid = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => roomTemp)
    );
}
setGrid();

let materialGrid = [];
function makeMaterialGrid() {


    // Center coordinates
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);

    // Square bounds (10 left/right, 10 up/down from center)
    const squareSize = 50;
    const half = squareSize / 2;

    for (let y = 0; y < height; y++) {
        materialGrid[y] = [];
        for (let x = 0; x < width; x++) {
            // Default value
            materialGrid[y][x] = mateerial1SpecificHeat;

            // If within 20x20 square centered on grid
            if (
                x >= centerX - half && x < centerX + half //&&
                // y >= centerY - half && y < centerY + half
            ) {
                materialGrid[y][x] = mateerial2SpecificHeat;
            }
        }
    }
}
makeMaterialGrid();

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = width * pxSize;
canvas.height = height * pxSize;

function getColorForValue(val) {
    if (val == 0) {
        return '#000000'
    }
    return colorMap[val % 10];
}

function getTemperatureColorForValue(value, material) {
    // Clamp 0–1000
    value = Math.max(0, Math.min(1000, value));

    // Invert and normalize
    const t = Math.pow(value / 1000, 0.5);

    // Scale red down, green and blue stay 0
    const r = Math.floor(255 * (t)); // or just: Math.floor(255 * value / 1000)
    return `rgb(${r}, 0, 0)`;
}

let mode = 'atomic'

function drawPixel(x, y, val, material) {
    if (mode == 'atomic') {
        ctx.fillStyle = getColorForValue(val);
        ctx.fillRect(x * pxSize, y * pxSize, pxSize, pxSize);
    } else if (mode == 'temp') {
        ctx.fillStyle = getTemperatureColorForValue(val, material);
        ctx.fillRect(x * pxSize, y * pxSize, pxSize, pxSize);
    }
}

function spreadHeat() {
    let newGrid = Array.from({ length: height }, () =>
        new Array(width)
    );

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {

            // // 🔒 Lock top row to 0
            // if (y === 0) {
            //   newGrid[y][x] = 1000;
            //   drawPixel(x, y, 1000, materialGrid[y][x]);
            //   continue;
            // }

            // 🔒 Lock bottom row to 1000
            // if (y === height - 1) {
            //   newGrid[y][x] = 100;
            //   drawPixel(x, y, 0, materialGrid[y][x]);
            //   continue;
            // }

            let dev = materialGrid[y][x] + 4;
            const v = valueGrid[y][x];
            let sV = Math.floor(v / dev);
            const self = sV * (dev - 4);
            const rem = v % dev;

            // fallback to self if neighbor is missing
            const up = valueGrid[y - 1]?.[x] ?? v;
            const upDev = materialGrid[y - 1]?.[x] ?? dev - 4;
            const down = valueGrid[y + 1]?.[x] ?? v;
            const downDev = materialGrid[y + 1]?.[x] ?? dev - 4;
            const left = valueGrid[y]?.[x - 1] ?? v;
            const leftDev = materialGrid[y]?.[x - 1] ?? dev - 4;
            const right = valueGrid[y]?.[x + 1] ?? v;
            const rightDev = materialGrid[y]?.[x + 1] ?? dev - 4;

            // integer 1/5 of each neighbor
            const newVal = self + rem +
                Math.floor(up / (upDev + 4)) +
                Math.floor(down / (downDev + 4)) +
                Math.floor(left / (leftDev + 4)) +
                Math.floor(right / (rightDev + 4));

            newGrid[y][x] = newVal;
            drawPixel(x, y, newVal, materialGrid[y][x]);
        }
    }

    valueGrid = newGrid;
}

function runBuoyancy() {
    for (let y = height - 2; y >= 0; y--) {
        for (let x = 0; x < width; x++) {
            const currentVal = valueGrid[y][x];
            const aboveVal = valueGrid[y + 1][x];

            const currentMaterial = materialGrid[y][x];
            const aboveMaterial = materialGrid[y + 1][x];

            // Optionally weight buoyancy by material density (lower = more buoyant)
            const currentEffective = currentVal / (currentMaterial + 1);
            const aboveEffective = aboveVal / (aboveMaterial + 1);

            // Simple swap if hotter and "lighter"
            if (currentEffective > aboveEffective) {
                // Swap values
                [valueGrid[y][x], valueGrid[y + 1][x]] = [valueGrid[y + 1][x], valueGrid[y][x]];
                [materialGrid[y][x], materialGrid[y + 1][x]] = [materialGrid[y + 1][x], materialGrid[y][x]];

                // Optionally redraw swapped pixels
                drawPixel(x, y, valueGrid[y][x], materialGrid[y][x]);
                drawPixel(x, y + 1, valueGrid[y + 1][x], materialGrid[y + 1][x]);
            }
        }
    }
}

function randomizeGrid() {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            valueGrid[y][x] = 0;
        }
    }
}

// Initial draw
spreadHeat();

// Update loop every second
setInterval(() => {
    //randomizeGrid();
    for (let i = 0; i < speedValue; i++) {
        spreadHeat();
        //runBuoyancy();
    }
}, 1);

// Click to manually randomize a single pixel
let isMouseDown = false;





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



const roomTempInput = document.getElementById('roomTempInput');

// Update JS variable when user types
roomTempInput.addEventListener('input', () => {
    roomTemp = parseInt(roomTempInput.value) || 0;
    console.log('roomTemp =', roomTemp);
});

// Optional: update input if `roomTemp` changes elsewhere in code
function setRoomTemp(val) {
    roomTemp = val;
    roomTempInput.value = val;
}

// const updateRoomTempDisplay = () => {
//   document.getElementById('tempValue').textContent = roomTemp;
// };

// document.getElementById('tempUp').addEventListener('click', () => {
//   roomTemp++;
//   updateRoomTempDisplay();
// });

// document.getElementById('tempDown').addEventListener('click', () => {
//   roomTemp--;
//   updateRoomTempDisplay();
// });

document.getElementById('reset').addEventListener('click', () => {
    setGrid();
});

document.getElementById('temp').addEventListener('click', () => {
    mode = 'temp';
});

document.getElementById('atomic').addEventListener('click', () => {
    mode = 'atomic';
});