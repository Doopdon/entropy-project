// Heat spreading simulation - generates new grid values
function spreadHeat() {
    let newGrid = Array.from({ length: height }, () =>
        new Array(width)
    );

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (materialGrid[y][x] == 0) {
                standardHeadFlow(y, x, newGrid)
            } else {
                newGrid[y][x] = -1;
            }
        }
    }

    temperatureGrid = newGrid;
}

function runPipes() {
    let lastPipe = pipeList[pipeList.length - 1]
    let lastValue = temperatureGrid[lastPipe.y][lastPipe.x];
    let firstPipe = pipeList[0];
    let firstValue = temperatureGrid[firstPipe.y][firstPipe.x];
    pipeList.forEach(v => {
        let t = temperatureGrid[v.y][v.x]
        temperatureGrid[v.y][v.x] = firstValue;
        firstValue = t;
    })
    temperatureGrid[firstPipe.y][firstPipe.x] = lastValue;
}

function standardHeadFlow(y, x, newGrid) {
    const v = temperatureGrid[y][x];
    const self = Math.floor(v / 5);
    const rem = v % 5;

    let up = temperatureGrid[y - 1]?.[x];
    if (up === undefined || materialGrid[y - 1][x] == 1) {
        up = v - rem
    }

    let down = temperatureGrid[y + 1]?.[x];
    if (down === undefined || materialGrid[y + 1][x] == 1) {
        down = v - rem
    }

    let left = temperatureGrid[y]?.[x - 1];
    if (left === undefined || materialGrid[y][x - 1] == 1) {
        left = v - rem
    }

    let right = temperatureGrid[y]?.[x + 1];
    if (right === undefined || materialGrid[y][x + 1] == 1) {
        right = v - rem
    }


    // fallback to self if neighbor is missing
    //const right = temperatureGrid[y - 1]?.[x] ?? v - rem;
    // const down = temperatureGrid[y + 1]?.[x] ?? v - rem;
    //const left = temperatureGrid[y]?.[x - 1] ?? v - rem;
    //const right = temperatureGrid[y]?.[x + 1] ?? v - rem;

    // integer 1/5 of each neighbor
    const newVal = self + rem +
        Math.floor(up / 5) +
        Math.floor(down / 5) +
        Math.floor(left / 5) +
        Math.floor(right / 5);

    newGrid[y][x] = newVal;
}

// Display function - renders the current grid to canvas
function displayGrid() {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            drawPixel(x, y, temperatureGrid[y][x]);
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
                runPipes();
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
                runPipes();
                startSimulation.lastUpdate = now;
            }
        }
    }, 1);
}

// Start the simulation
startSimulation();
