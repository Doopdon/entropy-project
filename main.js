// Main entry point for the entropy simulation
// This file coordinates the initialization and ensures proper module loading order

// The modules are loaded in the following order via HTML:
// 1. setup.js - Configuration, canvas setup, grid initialization
// 2. simulation.js - Physics simulation and heat spreading
// 3. interaction.js - User interface and mouse interactions

// All initialization happens automatically when the modules load:
// - setup.js initializes the grids and canvas
// - simulation.js starts the heat spreading loop
// - interaction.js sets up event listeners

console.log('Entropy simulation loaded successfully');
console.log('Grid dimensions:', width, 'x', height);
console.log('Pixel size:', pxSize);
console.log('Current mode:', mode);
