// Heat spreading simulation
function spreadHeat() {
    let newGrid = Array.from({ length: height }, () =>
        new Array(width)
    );

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
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
