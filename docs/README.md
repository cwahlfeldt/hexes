# Hexes Documentation

Welcome to the Hexes documentation! This library provides a functional, immutable approach to working with hexagonal grids in JavaScript.

## Quick Links

- **[Getting Started](./getting-started.md)** - Installation and basic usage
- **[API Reference](./api-reference.md)** - Complete function documentation
- **[Tutorial: Building a Game](./tutorial-game.md)** - Step-by-step tactical game tutorial
- **[Coordinate Systems](./coordinates.md)** - Understanding hex coordinates
- **[Examples](./examples.md)** - Common patterns and use cases

## What is Hexes?

Hexes is a pure JavaScript library for working with hexagonal grids. It provides:

- ✨ **Immutable operations** - Every function returns a new grid state
- 🎯 **Built-in pathfinding** - A* algorithm included
- 🧮 **Simple coordinate system** - Clean cube coordinate math
- 🎨 **Multiple layouts** - Pointy-top and flat-top support
- 🔧 **Zero dependencies** - Pure JavaScript only
- 📦 **Flexible shapes** - Rectangle, hexagon, triangle, and custom grids

## Installation

```bash
npm install hexes
```

## Quick Example

```javascript
import { createGrid, setPassable, findPath } from 'hexes';

// Create a grid
let grid = createGrid(10, 10, { layout: 'pointy' });

// Add obstacles
grid = setPassable(grid, { x: 2, y: -1, z: -1 }, false);

// Find a path
const path = findPath(
  grid,
  { x: 0, y: 0, z: 0 },
  { x: 5, y: -3, z: -2 }
);

console.log('Path:', path);
```

## Key Concepts

### Immutability

All operations return new grids without modifying the original:

```javascript
const grid1 = createGrid(5, 5);
const grid2 = setPassable(grid1, { x: 0, y: 0, z: 0 }, false);
// grid1 is unchanged, grid2 is a new grid
```

This makes it easy to:
- Implement undo/redo
- Track state history
- Compare different states
- Avoid bugs from mutation

### Cube Coordinates

Hexes uses cube coordinates where `x + y + z = 0`:

```javascript
{ x: 0, y: 0, z: 0 }   // Center
{ x: 1, y: -1, z: 0 }  // One step right
```

This makes hex math simple and symmetric. See [Coordinate Systems](./coordinates.md) for details.

### Pure Functions

Every function is pure - same inputs always produce same outputs, no side effects:

```javascript
const path1 = findPath(grid, start, end);
const path2 = findPath(grid, start, end);
// path1 === path2 (same result every time)
```

## Use Cases

### Game Development

- Turn-based strategy games
- Tactical RPGs
- Board game implementations
- Roguelikes with hex movement

### Simulation

- Pathfinding simulations
- Terrain analysis
- Coverage calculations
- Spatial algorithms

### Visualization

- Interactive hex grid displays
- Data visualization on hex grids
- Map editing tools
- Procedural generation

## Documentation Structure

### For Beginners

1. Start with [Getting Started](./getting-started.md)
2. Follow the [Game Tutorial](./tutorial-game.md)
3. Explore [Examples](./examples.md)

### For Reference

- [API Reference](./api-reference.md) - All functions documented
- [Coordinate Systems](./coordinates.md) - Detailed coordinate guide

## Interactive Demo

Check out the [interactive demo](../index.html) to see Hexes in action:

- Multiple grid shapes (rectangle, hexagon, triangle, diamond, trapezoid, parallelogram)
- Adjustable grid size
- Pointy-top and flat-top layouts
- Obstacle placement
- A* pathfinding visualization
- Range and line-of-sight demos

## Core Philosophy

Hexes follows these principles:

1. **Immutable by default** - State changes are explicit
2. **Pure functions** - Predictable and testable
3. **Simple API** - Easy to learn and use
4. **Zero magic** - No hidden state or side effects
5. **Performance** - Efficient algorithms and data structures

## Browser Support

Hexes works in all modern browsers and Node.js environments that support:

- ES6 modules
- Map data structure
- Basic ES6 features (arrow functions, destructuring, etc.)

## Performance

Hexes is designed for interactive applications:

- Grids with thousands of cells
- Real-time pathfinding
- Fast neighbor lookups
- Efficient coordinate conversion

For very large grids (10,000+ cells), consider:
- Chunking your grid
- Lazy evaluation
- Caching expensive operations

## Contributing

Found a bug or want to contribute? Check out the [GitHub repository](https://github.com/yourusername/hexes).

## License

MIT - See LICENSE file for details

## Credits

Hexes was inspired by:
- [Red Blob Games](https://www.redblobgames.com/grids/hexagons/) - Excellent hex grid guide
- [Amit Patel](https://twitter.com/redblobgames) - Pathfinding and grid algorithms

## Getting Help

- Read the [Getting Started](./getting-started.md) guide
- Check the [API Reference](./api-reference.md)
- Try the [interactive demo](../index.html)
- Look at the [examples](./examples.md)

Happy hex coding! 🎮⬡
