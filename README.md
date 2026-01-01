# Hexes

A functional, immutable hex grid library in pure JavaScript with built-in pathfinding.

## Features

- **Immutable by default** - Every operation returns a new grid state
- **Pure functions** - No side effects, predictable behavior
- **Simple API** - Minimal surface area, easy to learn
- **Zero dependencies** - Pure JavaScript only
- **Built-in pathfinding** - A* algorithm included
- **Flexible coordinates** - Cube, offset, and pixel coordinate systems

## Installation

```bash
npm install hexes
```

## Quick Start

```javascript
import { createGrid, setPassable, findPath, getNeighbors } from 'hexes'

// Create a 10x10 grid
let grid = createGrid(10, 10, { layout: 'pointy' })

// Add some obstacles
grid = setPassable(grid, { x: 2, y: -1, z: -1 }, false)
grid = setPassable(grid, { x: 3, y: -2, z: -1 }, false)

// Find a path
const path = findPath(grid, { x: 0, y: 0, z: 0 }, { x: 5, y: -3, z: -2 })

// Get neighbors of a cell
const neighbors = getNeighbors(grid, { x: 0, y: 0, z: 0 })
```

## Core Concepts

### Coordinates

Hexes uses **cube coordinates** where `x + y + z = 0`. This system makes hex math simple and elegant.

```javascript
{ x: 0, y: 0, z: 0 }  // Center hex
{ x: 1, y: -1, z: 0 } // One step to the right
```

### Grid State

Grids are immutable. Every operation returns a new grid:

```javascript
const grid1 = createGrid(5, 5)
const grid2 = setPassable(grid1, { x: 0, y: 0, z: 0 }, false)
// grid1 is unchanged, grid2 is a new grid
```

### Cells

Each cell has:
- `coord`: Position in cube coordinates
- `passable`: Whether pathfinding can traverse it
- `data`: User-defined payload

```javascript
{
  coord: { x, y, z },
  passable: true,
  data: { terrain: 'grass', height: 1 }
}
```

## API Reference

### Grid Creation

#### `createGrid(width, height, options?)`

Create a rectangular grid.

```javascript
const grid = createGrid(10, 10, {
  layout: 'pointy',  // or 'flat'
  defaultData: { terrain: 'grass' }
})
```

#### `createHexGrid(radius, options?)`

Create a hexagon-shaped grid.

```javascript
const grid = createHexGrid(5, { layout: 'pointy' })
```

#### `createCustomGrid(predicate, bounds, options?)`

Create a custom-shaped grid.

```javascript
const grid = createCustomGrid(
  (coord) => coord.x >= 0 && coord.y >= 0,
  { minX: -5, maxX: 5, minY: -5, maxY: 5 }
)
```

### Cell Operations

#### `getCell(grid, coord)`

Get a cell at a coordinate.

```javascript
const cell = getCell(grid, { x: 0, y: 0, z: 0 })
```

#### `setCell(grid, coord, cell)`

Set a cell (returns new grid).

```javascript
const newGrid = setCell(grid, { x: 0, y: 0, z: 0 }, {
  coord: { x: 0, y: 0, z: 0 },
  passable: true,
  data: { treasure: true }
})
```

#### `updateCell(grid, coord, updater)`

Update a cell using a function (returns new grid).

```javascript
const newGrid = updateCell(grid, { x: 0, y: 0, z: 0 }, (cell) => ({
  ...cell,
  data: { ...cell.data, visited: true }
}))
```

#### `removeCell(grid, coord)`

Remove a cell from the grid (returns new grid).

```javascript
const newGrid = removeCell(grid, { x: 0, y: 0, z: 0 })
```

### Obstacle Management

#### `setPassable(grid, coord, passable)`

Set whether a cell is passable (returns new grid).

```javascript
const newGrid = setPassable(grid, { x: 2, y: -1, z: -1 }, false)
```

#### `isPassable(grid, coord)`

Check if a cell is passable.

```javascript
const canPass = isPassable(grid, { x: 0, y: 0, z: 0 })
```

#### `getObstacles(grid)`

Get all obstacle coordinates.

```javascript
const obstacles = getObstacles(grid)
// [{ x: 2, y: -1, z: -1 }, { x: 3, y: -2, z: -1 }]
```

### Neighbors & Distance

#### `getNeighbors(grid, coord, options?)`

Get neighboring coordinates.

```javascript
const neighbors = getNeighbors(grid, { x: 0, y: 0, z: 0 })
const passableNeighbors = getNeighbors(grid, { x: 0, y: 0, z: 0 }, { passableOnly: true })
```

#### `distance(coordA, coordB)`

Calculate distance between coordinates.

```javascript
const dist = distance({ x: 0, y: 0, z: 0 }, { x: 3, y: -2, z: -1 })
```

#### `getRange(grid, coord, range)`

Get all cells within a range.

```javascript
const cellsInRange = getRange(grid, { x: 0, y: 0, z: 0 }, 3)
```

#### `getRing(grid, coord, radius)`

Get cells exactly at a distance.

```javascript
const ring = getRing(grid, { x: 0, y: 0, z: 0 }, 2)
```

#### `getReachable(grid, start, maxDistance)`

Get all reachable cells considering passability.

```javascript
const reachable = getReachable(grid, { x: 0, y: 0, z: 0 }, 5)
```

### Pathfinding

#### `findPath(grid, start, end, options?)`

Find a path using A*.

```javascript
const path = findPath(grid, start, end)
// [{ x: 0, y: 0, z: 0 }, { x: 1, y: -1, z: 0 }, ...]

// With custom cost function
const path = findPath(grid, start, end, {
  costFn: (from, to) => {
    const fromCell = getCell(grid, from)
    return fromCell.data.terrain === 'water' ? 3 : 1
  }
})

// Returns null if no path exists
```

#### `getPathCost(path, costFn?)`

Calculate total cost of a path.

```javascript
const cost = getPathCost(path, (from, to) => 1)
```

#### `getPathLength(path)`

Get the number of steps in a path.

```javascript
const length = getPathLength(path)
```

### Line of Sight

#### `getLine(coordA, coordB)`

Get all coordinates in a line.

```javascript
const line = getLine({ x: 0, y: 0, z: 0 }, { x: 3, y: -2, z: -1 })
```

#### `hasLineOfSight(grid, coordA, coordB)`

Check if there's a clear line of sight.

```javascript
const canSee = hasLineOfSight(grid, { x: 0, y: 0, z: 0 }, { x: 5, y: -3, z: -2 })
```

#### `getVisibleCells(grid, origin, maxRange?)`

Get all visible cells from a position.

```javascript
const visible = getVisibleCells(grid, { x: 0, y: 0, z: 0 }, 10)
```

### Coordinate Conversion

#### `cubeToPixel(coord, layout, hexSize)`

Convert cube coordinate to pixel position.

```javascript
const pixel = cubeToPixel({ x: 1, y: -1, z: 0 }, 'pointy', 32)
// { x: 55.4, y: 0 }
```

#### `pixelToCube(pixel, layout, hexSize)`

Convert pixel position to cube coordinate.

```javascript
const coord = pixelToCube({ x: 55.4, y: 0 }, 'pointy', 32)
// { x: 1, y: -1, z: 0 }
```

#### `cubeToOffset(coord, layout)`

Convert cube to offset coordinates.

```javascript
const offset = cubeToOffset({ x: 1, y: -1, z: 0 }, 'pointy')
// { col: 1, row: 0 }
```

#### `offsetToCube(offset, layout)`

Convert offset to cube coordinates.

```javascript
const coord = offsetToCube({ col: 1, row: 0 }, 'pointy')
// { x: 1, y: -1, z: 0 }
```

### Iteration

#### `mapCells(grid, fn)`

Transform all cells (returns new grid).

```javascript
const newGrid = mapCells(grid, (cell) => ({
  ...cell,
  data: { ...cell.data, explored: false }
}))
```

#### `filterCells(grid, predicate)`

Get coordinates of cells matching a condition.

```javascript
const treasureCells = filterCells(grid, (cell) => cell.data.treasure === true)
```

#### `forEachCell(grid, fn)`

Iterate over all cells.

```javascript
forEachCell(grid, (cell) => {
  console.log(cell.coord, cell.data)
})
```

## Examples

### State History (Undo/Redo)

```javascript
const history = [createGrid(10, 10)]

function applyChange(changeFn) {
  const newGrid = changeFn(history[history.length - 1])
  history.push(newGrid)
  return newGrid
}

applyChange(g => setPassable(g, { x: 1, y: 0, z: -1 }, false))
applyChange(g => setPassable(g, { x: 2, y: -1, z: -1 }, false))

// Undo: history.pop()
// Current state: history[history.length - 1]
```

### Custom Terrain Costs

```javascript
let grid = createGrid(10, 10)

// Set terrain types
grid = updateCell(grid, { x: 1, y: 0, z: -1 }, (cell) => ({
  ...cell,
  data: { terrain: 'water' }
}))

// Find path considering terrain
const path = findPath(grid, start, end, {
  costFn: (from, to) => {
    const toCell = getCell(grid, to)
    if (toCell.data.terrain === 'water') return 3
    if (toCell.data.terrain === 'mountain') return 5
    return 1
  }
})
```

### Field of View

```javascript
const visible = getVisibleCells(grid, playerPosition, 10)

// Mark visible cells
let newGrid = grid
for (const coord of visible) {
  newGrid = updateCell(newGrid, coord, (cell) => ({
    ...cell,
    data: { ...cell.data, visible: true }
  }))
}
```

## License

MIT
