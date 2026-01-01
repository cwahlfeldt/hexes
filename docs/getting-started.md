# Getting Started with Hexes

Welcome to Hexes, a functional and immutable hex grid library for JavaScript! This guide will help you get up and running quickly.

## Installation

```bash
npm install hexes
```

Or include it directly in your project:

```javascript
import { createGrid, findPath, getNeighbors } from 'hexes';
```

## Your First Grid

Let's create a simple 10x10 rectangular hex grid:

```javascript
import { createGrid } from 'hexes';

// Create a grid with pointy-top hexagons
const grid = createGrid(10, 10, { layout: 'pointy' });

console.log('Total cells:', grid.cells.size); // 100
```

## Understanding Coordinates

Hexes uses **cube coordinates** where `x + y + z = 0`. This makes hex math elegant and simple:

```javascript
// The center hex
{ x: 0, y: 0, z: 0 }

// One step to the right
{ x: 1, y: -1, z: 0 }

// One step down-right (pointy-top)
{ x: 0, y: -1, z: 1 }
```

## Getting and Setting Cells

```javascript
import { getCell, setPassable, updateCell } from 'hexes';

// Get a cell
const cell = getCell(grid, { x: 0, y: 0, z: 0 });
console.log(cell);
// {
//   coord: { x: 0, y: 0, z: 0 },
//   passable: true,
//   data: {}
// }

// Mark a cell as an obstacle (immutable - returns new grid)
const gridWithObstacle = setPassable(grid, { x: 1, y: -1, z: 0 }, false);

// Update cell data
const gridWithData = updateCell(grid, { x: 0, y: 0, z: 0 }, (cell) => ({
  ...cell,
  data: { treasure: true, value: 100 }
}));
```

## Finding Neighbors

```javascript
import { getNeighbors } from 'hexes';

const neighbors = getNeighbors(grid, { x: 0, y: 0, z: 0 });
console.log('Neighbors:', neighbors.length); // Up to 6

// Get only passable neighbors
const passableNeighbors = getNeighbors(grid, { x: 0, y: 0, z: 0 }, {
  passableOnly: true
});
```

## Basic Pathfinding

```javascript
import { createGrid, setPassable, findPath } from 'hexes';

// Create grid with some obstacles
let grid = createGrid(10, 10);
grid = setPassable(grid, { x: 2, y: -1, z: -1 }, false);
grid = setPassable(grid, { x: 3, y: -2, z: -1 }, false);

// Find a path from start to end
const start = { x: 0, y: 0, z: 0 };
const end = { x: 5, y: -3, z: -2 };
const path = findPath(grid, start, end);

if (path) {
  console.log('Path found!', path.length, 'steps');
  path.forEach((coord, i) => {
    console.log(`Step ${i}:`, coord);
  });
} else {
  console.log('No path exists');
}
```

## Calculating Distance

```javascript
import { distance, getRange } from 'hexes';

const coord1 = { x: 0, y: 0, z: 0 };
const coord2 = { x: 3, y: -2, z: -1 };

console.log('Distance:', distance(coord1, coord2)); // 3

// Get all cells within range 3
const cellsInRange = getRange(grid, coord1, 3);
console.log('Cells in range:', cellsInRange.length);
```

## Different Grid Shapes

Hexes supports multiple grid shapes:

```javascript
import { createGrid, createHexGrid, createCustomGrid } from 'hexes';

// Rectangular grid
const rectGrid = createGrid(15, 10);

// Hexagonal grid (radius 6)
const hexGrid = createHexGrid(6);

// Custom triangle shape
const triangleGrid = createCustomGrid(
  (coord) => coord.x >= 0 && coord.y <= 0 && coord.z >= 0,
  { minX: 0, maxX: 10, minY: -10, maxY: 0 }
);
```

## Layouts: Pointy vs Flat

Hexes supports both pointy-top (⬡) and flat-top (⬢) orientations:

```javascript
// Pointy-top (default) - vertices at top and bottom
const pointyGrid = createGrid(10, 10, { layout: 'pointy' });

// Flat-top - flat edges at top and bottom
const flatGrid = createGrid(10, 10, { layout: 'flat' });
```

## Next Steps

Now that you know the basics, explore:

- [API Reference](./api-reference.md) - Complete API documentation
- [Tutorial: Building a Game](./tutorial-game.md) - Build a simple tactical game
- [Examples](./examples.md) - Common patterns and use cases
- [Coordinate Systems](./coordinates.md) - Deep dive into hex coordinates

## Key Concepts to Remember

1. **Immutability** - All operations return new grids; original grids never change
2. **Cube Coordinates** - `x + y + z = 0` always
3. **Pure Functions** - No side effects, predictable results
4. **Pathfinding Built-in** - A* algorithm included out of the box
