# Entropy Project

This is a simple cellular automata simulation for heat diffusion and entropy visualization. The project demonstrates how heat spreads and diffuses across a grid.

## Features

- **Heat Simulation**: Click and drag on the canvas to add heat (temperature = 1000)
- **Visualization Modes**: 
  - Atomic mode: Shows discrete heat values with colors
  - Temperature mode: Shows heat as red intensity
- **Interactive Controls**:
  - Speed control: Adjust simulation speed
  - Room temperature: Set base temperature
  - Reset: Clear the simulation
  - Mode switching: Toggle between atomic and temperature views

## File Structure

The project has been modularized into separate files for better organization:

- **`index.html`**: Main HTML file with UI controls and canvas
- **`setup.js`**: Configuration, initialization, canvas setup, and grid creation
- **`simulation.js`**: Physics simulation and heat spreading algorithm
- **`interaction.js`**: User interface event handlers and mouse interactions
- **`main.js`**: Entry point and coordination between modules

## How to Run

1. Open `index.html` in a web browser
2. Click and drag on the canvas to add heat
3. Use the controls to adjust simulation parameters
4. Switch between atomic and temperature visualization modes

## Technical Details

- **Grid Size**: 600x300 pixels with 2px rendering size
- **Heat Algorithm**: Diffusion-based cellular automata with uniform heat conductivity
- **Update Rate**: 1ms intervals with configurable speed multiplier

## Future Plans

- Server integration for multi-user simulations
- React UI for better user experience
- More complex material properties and physics
- Additional visualization modes
