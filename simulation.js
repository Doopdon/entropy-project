// Heat spreading simulation - generates new grid values
function generateGrid() {
    let newGrid = Array.from({ length: height }, () =>
        new Array(width)
    );

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const v = valueGrid[y][x];
            const self = Math.floor(v / 5);
            const rem = v % 5;

            // fallback to self if neighbor is missing
            const up = valueGrid[y - 1]?.[x] ?? v-rem;
            const down = valueGrid[y + 1]?.[x] ?? v-rem;
            const left = valueGrid[y]?.[x - 1] ?? v-rem;
            const right = valueGrid[y]?.[x + 1] ?? v-rem;

            // integer 1/5 of each neighbor
            const newVal = self + rem +
                Math.floor(up / 5) +
                Math.floor(down / 5) +
                Math.floor(left / 5) +
                Math.floor(right / 5);

            newGrid[y][x] = newVal;
        }
    }

    valueGrid = newGrid;
}

// Display function - renders the current grid to canvas
function displayGrid() {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            drawPixel(x, y, valueGrid[y][x]);
        }
    }
}

// Combined function that calls generation then display
function spreadHeat() {
    generateGrid();
    displayGrid();
}


// Start the simulation
function startSimulation() {
    // Initial draw
    spreadHeat();

    // Update loop every millisecond
    setInterval(() => {
        for (let i = 0; i < speedValue; i++) {
            spreadHeat();
        }
    }, 1);
}

// Start the simulation
startSimulation();
