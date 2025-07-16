// Heat spreading simulation - generates new grid values
function spreadHeat() {
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

// Start the simulation
function startSimulation() {
    // Initial draw
    spreadHeat();
    displayGrid();

    // Update loop with dynamic interval based on speed
    setInterval(() => {
        if (speedValue === 0) {
            // Paused - do nothing
            return;
        } else if (speedValue > 0) {
            // Positive speed - run multiple iterations per millisecond
            for (let i = 0; i < speedValue; i++) {
                spreadHeat();
            }
            displayGrid();
        } else {
            // Negative speed - run slower with increasing factors of 10
            // -1: every 10ms, -2: every 100ms, -3: every 1000ms, etc.
            const intervalFactor = Math.pow(10, Math.abs(speedValue));
            
            // Use a timestamp to control timing for negative speeds
            if (!startSimulation.lastUpdate) {
                startSimulation.lastUpdate = Date.now();
            }
            
            const now = Date.now();
            if (now - startSimulation.lastUpdate >= intervalFactor) {
                spreadHeat();
                displayGrid();
                startSimulation.lastUpdate = now;
            }
        }
    }, 1);
}

// Start the simulation
startSimulation();
