# Examples

Common patterns and practical examples for using Hexes.

## Table of Contents

- [Basic Grid Operations](#basic-grid-operations)
- [Pathfinding Patterns](#pathfinding-patterns)
- [Range and Movement](#range-and-movement)
- [Line of Sight](#line-of-sight)
- [State Management](#state-management)
- [Custom Shapes](#custom-shapes)
- [Rendering](#rendering)

---

## Basic Grid Operations

### Creating Different Grid Shapes

```javascript
import { createGrid, createHexGrid, createCustomGrid } from 'hexes';

// Rectangular grid (15x10)
const rectGrid = createGrid(15, 10, { layout: 'pointy' });

// Hexagonal grid (radius 6)
const hexGrid = createHexGrid(6, { layout: 'flat' });

// Triangle shape
const triangle = createCustomGrid(
  (coord) => coord.x >= 0 && coord.y <= 0 && coord.z >= 0,
  { minX: 0, maxX: 10, minY: -10, maxY: 0 }
);

// Diamond/rhombus shape
const diamond = createCustomGrid(
  (coord) => Math.abs(coord.x) <= 5 && Math.abs(coord.y) <= 5,
  { minX: -5, maxX: 5, minY: -5, maxY: 5 }
);
```

### Adding Obstacles

```javascript
import { setPassable } from 'hexes';

let grid = createGrid(10, 10);

// Single obstacle
grid = setPassable(grid, { x: 2, y: -1, z: -1 }, false);

// Multiple obstacles
const obstacleCoords = [
  { x: 1, y: -1, z: 0 },
  { x: 2, y: -2, z: 0 },
  { x: 3, y: -3, z: 0 }
];

obstacleCoords.forEach(coord => {
  grid = setPassable(grid, coord, false);
});

// Random obstacles
grid.cells.forEach(cell => {
  if (Math.random() < 0.2) {
    grid = setPassable(grid, cell.coord, false);
  }
});
```

### Working with Cell Data

```javascript
import { updateCell, getCell, filterCells } from 'hexes';

// Add custom data to cells
grid = updateCell(grid, { x: 0, y: 0, z: 0 }, (cell) => ({
  ...cell,
  data: { terrain: 'water', moveCost: 3 }
}));

// Find all cells with treasure
const treasureCells = filterCells(grid, (cell) =>
  cell.data.treasure === true
);

// Mark all cells as unexplored
grid = mapCells(grid, (cell) => ({
  ...cell,
  data: { ...cell.data, explored: false }
}));
```

---

## Pathfinding Patterns

### Basic Pathfinding

```javascript
import { findPath } from 'hexes';

const start = { x: 0, y: 0, z: 0 };
const end = { x: 5, y: -3, z: -2 };

const path = findPath(grid, start, end);

if (path) {
  console.log('Found path with', path.length, 'steps');
  path.forEach((coord, i) => {
    console.log(`Step ${i}:`, coord);
  });
} else {
  console.log('No path available');
}
```

### Pathfinding with Terrain Costs

```javascript
import { findPath, getCell } from 'hexes';

// Define terrain costs
const terrainCosts = {
  grass: 1,
  water: 3,
  mountain: 5,
  road: 0.5
};

const path = findPath(grid, start, end, {
  costFn: (from, to) => {
    const toCell = getCell(grid, to);
    const terrain = toCell.data.terrain || 'grass';
    return terrainCosts[terrain];
  }
});
```

### Multiple Path Options

```javascript
// Find paths to multiple destinations
const destinations = [
  { x: 5, y: -3, z: -2 },
  { x: 3, y: 1, z: -4 },
  { x: -2, y: 4, z: -2 }
];

const paths = destinations.map(dest => ({
  destination: dest,
  path: findPath(grid, start, dest)
})).filter(p => p.path !== null);

// Sort by path length
paths.sort((a, b) => a.path.length - b.path.length);

console.log('Shortest path:', paths[0]);
```

### Avoiding Specific Cells

```javascript
// Temporarily block cells for pathfinding
const dangerZones = [
  { x: 2, y: -1, z: -1 },
  { x: 3, y: -2, z: -1 }
];

// Create temporary grid with danger zones blocked
let tempGrid = grid;
dangerZones.forEach(coord => {
  tempGrid = setPassable(tempGrid, coord, false);
});

const safePath = findPath(tempGrid, start, end);
```

---

## Range and Movement

### Movement Range

```javascript
import { getReachable } from 'hexes';

// Get all cells a unit can reach
const movementRange = 5;
const reachableCells = getReachable(grid, unitPosition, movementRange);

console.log('Can reach', reachableCells.length, 'cells');
```

### Attack Range

```javascript
import { getRange, distance } from 'hexes';

const attackRange = 3;
const cellsInRange = getRange(grid, attackerPosition, attackRange);

// Filter for enemy units
const targets = enemies.filter(enemy => {
  const dist = distance(attackerPosition, enemy.position);
  return dist <= attackRange;
});
```

### Ring Pattern (Surrounding Cells)

```javascript
import { getRing } from 'hexes';

// Get cells exactly 2 steps away (a ring)
const ring = getRing(grid, center, 2);

// Get all rings from 1 to 5
const rings = [];
for (let radius = 1; radius <= 5; radius++) {
  rings.push(getRing(grid, center, radius));
}
```

### Spiral Pattern

```javascript
import { getSpiral } from 'hexes';

// Get cells in spiral order from center
const spiral = getSpiral(grid, center, 5);

// Useful for expanding searches
spiral.forEach((coord, index) => {
  console.log(`Spiral step ${index}:`, coord);
});
```

---

## Line of Sight

### Check Visibility

```javascript
import { hasLineOfSight, getLine } from 'hexes';

const canSee = hasLineOfSight(grid, observer, target);

if (canSee) {
  console.log('Target is visible!');
  const line = getLine(observer, target);
  console.log('Line passes through:', line);
} else {
  console.log('Target is hidden');
}
```

### Field of View

```javascript
import { getVisibleCells } from 'hexes';

// Get all cells visible from a position
const visionRange = 10;
const visibleCells = getVisibleCells(grid, playerPosition, visionRange);

// Mark cells as visible
visibleCells.forEach(coord => {
  grid = updateCell(grid, coord, (cell) => ({
    ...cell,
    data: { ...cell.data, visible: true, explored: true }
  }));
});
```

### Fog of War

```javascript
// Track what the player has seen
const fogOfWar = new Set();

function updateFogOfWar(grid, playerPos, visionRange) {
  const visible = getVisibleCells(grid, playerPos, visionRange);

  visible.forEach(coord => {
    const key = `${coord.x},${coord.y},${coord.z}`;
    fogOfWar.add(key);
  });

  return visible;
}

// Check if a cell has been explored
function isExplored(coord) {
  const key = `${coord.x},${coord.y},${coord.z}`;
  return fogOfWar.has(key);
}
```

---

## State Management

### Undo/Redo System

```javascript
class GridHistory {
  constructor(initialGrid) {
    this.history = [initialGrid];
    this.currentIndex = 0;
  }

  apply(changeFn) {
    const newGrid = changeFn(this.current());

    // Remove any future states
    this.history = this.history.slice(0, this.currentIndex + 1);

    // Add new state
    this.history.push(newGrid);
    this.currentIndex++;

    return newGrid;
  }

  undo() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
    return this.current();
  }

  redo() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
    }
    return this.current();
  }

  current() {
    return this.history[this.currentIndex];
  }

  canUndo() {
    return this.currentIndex > 0;
  }

  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }
}

// Usage
const history = new GridHistory(createGrid(10, 10));

// Make changes
history.apply(g => setPassable(g, { x: 1, y: 0, z: -1 }, false));
history.apply(g => setPassable(g, { x: 2, y: -1, z: -1 }, false));

// Undo
const gridBefore = history.undo();

// Redo
const gridAfter = history.redo();
```

### Comparing Grid States

```javascript
function compareGrids(grid1, grid2) {
  const changes = [];

  // Check all cells in both grids
  const allKeys = new Set([
    ...grid1.cells.keys(),
    ...grid2.cells.keys()
  ]);

  allKeys.forEach(key => {
    const cell1 = grid1.cells.get(key);
    const cell2 = grid2.cells.get(key);

    if (!cell1) {
      changes.push({ type: 'added', coord: cell2.coord });
    } else if (!cell2) {
      changes.push({ type: 'removed', coord: cell1.coord });
    } else if (cell1.passable !== cell2.passable) {
      changes.push({
        type: 'passability',
        coord: cell1.coord,
        from: cell1.passable,
        to: cell2.passable
      });
    }
  });

  return changes;
}
```

---

## Custom Shapes

### Island Shape

```javascript
const island = createCustomGrid(
  (coord) => {
    // Circular island with radius 6
    const dist = Math.sqrt(coord.x ** 2 + coord.z ** 2);
    return dist <= 6;
  },
  { minX: -6, maxX: 6, minY: -6, maxY: 6 }
);
```

### Star Shape

```javascript
const star = createCustomGrid(
  (coord) => {
    // 6-pointed star
    const maxDist = 8;
    const minDist = 4;

    // Check if in one of the 6 "arms"
    const arms = [
      coord.x >= 0 && coord.y <= 0,
      coord.y <= 0 && coord.z >= 0,
      coord.z >= 0 && coord.x <= 0,
      coord.x <= 0 && coord.y >= 0,
      coord.y >= 0 && coord.z <= 0,
      coord.z <= 0 && coord.x >= 0
    ];

    const inArm = arms.some(arm => arm);
    const dist = (Math.abs(coord.x) + Math.abs(coord.y) + Math.abs(coord.z)) / 2;

    return inArm && dist <= maxDist;
  },
  { minX: -8, maxX: 8, minY: -8, maxY: 8 }
);
```

### Donut Shape

```javascript
const donut = createCustomGrid(
  (coord) => {
    const dist = (Math.abs(coord.x) + Math.abs(coord.y) + Math.abs(coord.z)) / 2;
    return dist >= 3 && dist <= 6;
  },
  { minX: -6, maxX: 6, minY: -6, maxY: 6 }
);
```

---

## Rendering

### Canvas Rendering

```javascript
import { cubeToPixel } from 'hexes';

function drawGrid(canvas, grid, hexSize = 30) {
  const ctx = canvas.getContext('2d');

  grid.cells.forEach(cell => {
    const pixel = cubeToPixel(cell.coord, grid.layout, hexSize);
    const center = {
      x: pixel.x + canvas.width / 2,
      y: pixel.y + canvas.height / 2
    };

    drawHex(ctx, center, hexSize, cell, grid.layout);
  });
}

function drawHex(ctx, center, size, cell, layout) {
  const angleOffset = layout === 'pointy' ? -Math.PI / 6 : 0;

  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + angleOffset;
    const x = center.x + size * Math.cos(angle);
    const y = center.y + size * Math.sin(angle);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();

  // Color based on cell properties
  ctx.fillStyle = cell.passable ? '#2d4059' : '#ea5455';
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();
}
```

### Mouse Picking

```javascript
import { pixelToCube } from 'hexes';

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Convert to grid-relative pixel
  const pixel = {
    x: x - canvas.width / 2,
    y: y - canvas.height / 2
  };

  // Convert to cube coordinate
  const coord = pixelToCube(pixel, grid.layout, hexSize);

  // Check if cell exists
  const cell = getCell(grid, coord);
  if (cell) {
    console.log('Clicked cell:', coord);
    handleCellClick(coord);
  }
});
```

---

## Performance Tips

### Batch Updates

```javascript
// Instead of multiple updates
grid = setPassable(grid, coord1, false);
grid = setPassable(grid, coord2, false);
grid = setPassable(grid, coord3, false);

// Do batch update
const updates = [coord1, coord2, coord3];
grid = mapCells(grid, (cell) => {
  const shouldBlock = updates.some(u =>
    u.x === cell.coord.x && u.y === cell.coord.y && u.z === cell.coord.z
  );

  return shouldBlock ? { ...cell, passable: false } : cell;
});
```

### Cache Expensive Calculations

```javascript
// Cache pathfinding results
const pathCache = new Map();

function getCachedPath(grid, start, end) {
  const key = `${hash(start)}-${hash(end)}`;

  if (!pathCache.has(key)) {
    const path = findPath(grid, start, end);
    pathCache.set(key, path);
  }

  return pathCache.get(key);
}

// Clear cache when grid changes
function updateGrid(newGrid) {
  pathCache.clear();
  return newGrid;
}
```
