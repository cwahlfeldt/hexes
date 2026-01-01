# API Reference

Complete reference for all Hexes library functions.

## Table of Contents

- [Grid Creation](#grid-creation)
- [Cell Operations](#cell-operations)
- [Obstacle Management](#obstacle-management)
- [Neighbors & Distance](#neighbors--distance)
- [Pathfinding](#pathfinding)
- [Line of Sight](#line-of-sight)
- [Coordinate Conversion](#coordinate-conversion)
- [Iteration](#iteration)

---

## Grid Creation

### `createGrid(width, height, options?)`

Create a rectangular hex grid.

**Parameters:**
- `width` (number) - Grid width
- `height` (number) - Grid height
- `options` (object, optional)
  - `layout` ('pointy' | 'flat') - Hex orientation (default: 'pointy')
  - `defaultData` (object) - Default data for all cells (default: {})

**Returns:** Grid object

**Example:**
```javascript
const grid = createGrid(10, 10, {
  layout: 'pointy',
  defaultData: { terrain: 'grass' }
});
```

---

### `createHexGrid(radius, options?)`

Create a hexagon-shaped grid.

**Parameters:**
- `radius` (number) - Hexagon radius
- `options` (object, optional) - Same as `createGrid`

**Returns:** Grid object

**Example:**
```javascript
const hexGrid = createHexGrid(5, { layout: 'flat' });
```

---

### `createCustomGrid(predicate, bounds, options?)`

Create a custom-shaped grid using a predicate function.

**Parameters:**
- `predicate` (function) - Function that takes a coord and returns boolean
- `bounds` (object) - { minX, maxX, minY, maxY }
- `options` (object, optional) - Same as `createGrid`

**Returns:** Grid object

**Example:**
```javascript
// Create a triangle
const triangle = createCustomGrid(
  (coord) => coord.x >= 0 && coord.y <= 0 && coord.z >= 0,
  { minX: 0, maxX: 10, minY: -10, maxY: 0 }
);
```

---

## Cell Operations

### `getCell(grid, coord)`

Get a cell at a coordinate.

**Parameters:**
- `grid` (Grid) - The grid
- `coord` (Coord) - { x, y, z }

**Returns:** Cell object or null

**Example:**
```javascript
const cell = getCell(grid, { x: 0, y: 0, z: 0 });
// { coord: { x: 0, y: 0, z: 0 }, passable: true, data: {} }
```

---

### `setCell(grid, coord, cell)`

Set a cell (returns new grid).

**Parameters:**
- `grid` (Grid) - The grid
- `coord` (Coord) - { x, y, z }
- `cell` (Cell) - Cell object

**Returns:** New Grid object

**Example:**
```javascript
const newGrid = setCell(grid, { x: 0, y: 0, z: 0 }, {
  coord: { x: 0, y: 0, z: 0 },
  passable: true,
  data: { treasure: true }
});
```

---

### `updateCell(grid, coord, updater)`

Update a cell using a function (returns new grid).

**Parameters:**
- `grid` (Grid) - The grid
- `coord` (Coord) - { x, y, z }
- `updater` (function) - Function that takes old cell and returns new cell

**Returns:** New Grid object

**Example:**
```javascript
const newGrid = updateCell(grid, { x: 0, y: 0, z: 0 }, (cell) => ({
  ...cell,
  data: { ...cell.data, visited: true }
}));
```

---

### `removeCell(grid, coord)`

Remove a cell from the grid (returns new grid).

**Parameters:**
- `grid` (Grid) - The grid
- `coord` (Coord) - { x, y, z }

**Returns:** New Grid object

**Example:**
```javascript
const newGrid = removeCell(grid, { x: 0, y: 0, z: 0 });
```

---

### `hasCell(grid, coord)`

Check if a coordinate exists in the grid.

**Parameters:**
- `grid` (Grid) - The grid
- `coord` (Coord) - { x, y, z }

**Returns:** Boolean

**Example:**
```javascript
if (hasCell(grid, { x: 0, y: 0, z: 0 })) {
  console.log('Cell exists');
}
```

---

## Obstacle Management

### `setPassable(grid, coord, passable)`

Set whether a cell is passable (returns new grid).

**Parameters:**
- `grid` (Grid) - The grid
- `coord` (Coord) - { x, y, z }
- `passable` (boolean) - Whether cell is passable

**Returns:** New Grid object

**Example:**
```javascript
const gridWithWall = setPassable(grid, { x: 2, y: -1, z: -1 }, false);
```

---

### `isPassable(grid, coord)`

Check if a cell is passable.

**Parameters:**
- `grid` (Grid) - The grid
- `coord` (Coord) - { x, y, z }

**Returns:** Boolean

**Example:**
```javascript
if (isPassable(grid, { x: 0, y: 0, z: 0 })) {
  console.log('Can walk here');
}
```

---

### `getObstacles(grid)`

Get all obstacle coordinates.

**Parameters:**
- `grid` (Grid) - The grid

**Returns:** Array of Coord objects

**Example:**
```javascript
const obstacles = getObstacles(grid);
console.log('Obstacles:', obstacles);
```

---

## Neighbors & Distance

### `getNeighbors(grid, coord, options?)`

Get neighboring coordinates.

**Parameters:**
- `grid` (Grid) - The grid
- `coord` (Coord) - { x, y, z }
- `options` (object, optional)
  - `passableOnly` (boolean) - Only return passable neighbors (default: false)

**Returns:** Array of Coord objects (up to 6)

**Example:**
```javascript
const allNeighbors = getNeighbors(grid, { x: 0, y: 0, z: 0 });
const passable = getNeighbors(grid, { x: 0, y: 0, z: 0 }, { passableOnly: true });
```

---

### `distance(coordA, coordB)`

Calculate Manhattan distance between two coordinates.

**Parameters:**
- `coordA` (Coord) - First coordinate
- `coordB` (Coord) - Second coordinate

**Returns:** Number

**Example:**
```javascript
const dist = distance({ x: 0, y: 0, z: 0 }, { x: 3, y: -2, z: -1 });
console.log('Distance:', dist); // 3
```

---

### `getRange(grid, coord, range)`

Get all cells within a range.

**Parameters:**
- `grid` (Grid) - The grid
- `coord` (Coord) - Center coordinate
- `range` (number) - Maximum distance

**Returns:** Array of Coord objects

**Example:**
```javascript
const cellsInRange = getRange(grid, { x: 0, y: 0, z: 0 }, 3);
```

---

### `getRing(grid, coord, radius)`

Get cells exactly at a distance.

**Parameters:**
- `grid` (Grid) - The grid
- `coord` (Coord) - Center coordinate
- `radius` (number) - Exact distance

**Returns:** Array of Coord objects

**Example:**
```javascript
const ring = getRing(grid, { x: 0, y: 0, z: 0 }, 2);
```

---

### `getReachable(grid, start, maxDistance)`

Get all cells reachable within a distance, considering obstacles.

**Parameters:**
- `grid` (Grid) - The grid
- `start` (Coord) - Starting coordinate
- `maxDistance` (number) - Maximum movement distance

**Returns:** Array of Coord objects

**Example:**
```javascript
// Get where a unit with movement 5 can reach
const reachable = getReachable(grid, { x: 0, y: 0, z: 0 }, 5);
```

---

## Pathfinding

### `findPath(grid, start, end, options?)`

Find shortest path using A* algorithm.

**Parameters:**
- `grid` (Grid) - The grid
- `start` (Coord) - Start coordinate
- `end` (Coord) - End coordinate
- `options` (object, optional)
  - `heuristic` (function) - Custom heuristic function
  - `costFn` (function) - Custom cost function

**Returns:** Array of Coord objects or null if no path

**Example:**
```javascript
const path = findPath(grid, start, end);

// With custom terrain costs
const path = findPath(grid, start, end, {
  costFn: (from, to) => {
    const cell = getCell(grid, to);
    return cell.data.terrain === 'water' ? 3 : 1;
  }
});
```

---

### `getPathCost(path, costFn?)`

Calculate total cost of a path.

**Parameters:**
- `path` (Array<Coord>) - Path coordinates
- `costFn` (function, optional) - Cost function (default: 1 per step)

**Returns:** Number

**Example:**
```javascript
const cost = getPathCost(path, (from, to) => 1);
```

---

### `getPathLength(path)`

Get number of steps in a path.

**Parameters:**
- `path` (Array<Coord>) - Path coordinates

**Returns:** Number

**Example:**
```javascript
const length = getPathLength(path);
```

---

## Line of Sight

### `getLine(coordA, coordB)`

Get all coordinates in a line between two points.

**Parameters:**
- `coordA` (Coord) - Start coordinate
- `coordB` (Coord) - End coordinate

**Returns:** Array of Coord objects

**Example:**
```javascript
const line = getLine({ x: 0, y: 0, z: 0 }, { x: 3, y: -2, z: -1 });
```

---

### `hasLineOfSight(grid, coordA, coordB)`

Check if there's a clear line of sight.

**Parameters:**
- `grid` (Grid) - The grid
- `coordA` (Coord) - Start coordinate
- `coordB` (Coord) - End coordinate

**Returns:** Boolean

**Example:**
```javascript
if (hasLineOfSight(grid, shooter, target)) {
  console.log('Clear shot!');
}
```

---

### `getVisibleCells(grid, origin, maxRange?)`

Get all cells visible from a position.

**Parameters:**
- `grid` (Grid) - The grid
- `origin` (Coord) - Observer position
- `maxRange` (number, optional) - Maximum vision range (default: Infinity)

**Returns:** Array of Coord objects

**Example:**
```javascript
const visible = getVisibleCells(grid, playerPos, 10);
```

---

## Coordinate Conversion

### `cubeToPixel(coord, layout, hexSize)`

Convert cube coordinate to pixel position.

**Parameters:**
- `coord` (Coord) - Cube coordinate
- `layout` ('pointy' | 'flat') - Hex orientation
- `hexSize` (number) - Hex size in pixels

**Returns:** { x, y } pixel position

**Example:**
```javascript
const pixel = cubeToPixel({ x: 1, y: -1, z: 0 }, 'pointy', 32);
```

---

### `pixelToCube(pixel, layout, hexSize)`

Convert pixel position to cube coordinate.

**Parameters:**
- `pixel` (object) - { x, y } pixel position
- `layout` ('pointy' | 'flat') - Hex orientation
- `hexSize` (number) - Hex size in pixels

**Returns:** Coord object

**Example:**
```javascript
const coord = pixelToCube({ x: 55.4, y: 0 }, 'pointy', 32);
```

---

### `cubeToOffset(coord, layout)`

Convert cube to offset coordinates.

**Parameters:**
- `coord` (Coord) - Cube coordinate
- `layout` ('pointy' | 'flat') - Hex orientation

**Returns:** { col, row }

**Example:**
```javascript
const offset = cubeToOffset({ x: 1, y: -1, z: 0 }, 'pointy');
```

---

### `offsetToCube(offset, layout)`

Convert offset to cube coordinates.

**Parameters:**
- `offset` (object) - { col, row }
- `layout` ('pointy' | 'flat') - Hex orientation

**Returns:** Coord object

**Example:**
```javascript
const coord = offsetToCube({ col: 1, row: 0 }, 'pointy');
```

---

## Iteration

### `mapCells(grid, fn)`

Transform all cells (returns new grid).

**Parameters:**
- `grid` (Grid) - The grid
- `fn` (function) - Function to transform each cell

**Returns:** New Grid object

**Example:**
```javascript
const exploredGrid = mapCells(grid, (cell) => ({
  ...cell,
  data: { ...cell.data, explored: false }
}));
```

---

### `filterCells(grid, predicate)`

Get coordinates of cells matching a condition.

**Parameters:**
- `grid` (Grid) - The grid
- `predicate` (function) - Function to test each cell

**Returns:** Array of Coord objects

**Example:**
```javascript
const treasures = filterCells(grid, (cell) => cell.data.treasure === true);
```

---

### `forEachCell(grid, fn)`

Iterate over all cells.

**Parameters:**
- `grid` (Grid) - The grid
- `fn` (function) - Function called for each cell

**Returns:** void

**Example:**
```javascript
forEachCell(grid, (cell) => {
  console.log(cell.coord, cell.data);
});
```

---

## Type Definitions

### Coord
```typescript
{
  x: number,
  y: number,
  z: number
}
// Constraint: x + y + z = 0
```

### Cell
```typescript
{
  coord: Coord,
  passable: boolean,
  data: object
}
```

### Grid
```typescript
{
  cells: Map<string, Cell>,
  layout: 'pointy' | 'flat',
  size: object
}
```
