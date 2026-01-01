import { hash, unhash, offsetToCube } from "./coord.js";

// Create a rectangular grid
export function createGrid(width, height, options = {}) {
  const { layout = "pointy", defaultData = {} } = options;
  const cells = new Map();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const coord = offsetToCube({ col, row }, layout);
      const key = hash(coord);
      cells.set(key, {
        coord,
        passable: true,
        data: { ...defaultData },
      });
    }
  }

  return {
    cells,
    layout,
    size: { width, height },
  };
}

// Create a hexagon-shaped grid
export function createHexGrid(radius, options = {}) {
  const { layout = "pointy", defaultData = {} } = options;
  const cells = new Map();

  for (let x = -radius; x <= radius; x++) {
    for (
      let y = Math.max(-radius, -x - radius);
      y <= Math.min(radius, -x + radius);
      y++
    ) {
      const z = -x - y;
      const coord = { x, y, z };
      const key = hash(coord);
      cells.set(key, {
        coord,
        passable: true,
        data: { ...defaultData },
      });
    }
  }

  return {
    cells,
    layout,
    size: { radius },
  };
}

// Create a custom-shaped grid using a predicate function
export function createCustomGrid(predicate, bounds, options = {}) {
  const { layout = "pointy", defaultData = {} } = options;
  const cells = new Map();

  const { minX, maxX, minY, maxY } = bounds;

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      const z = -x - y;
      const coord = { x, y, z };

      if (predicate(coord)) {
        const key = hash(coord);
        cells.set(key, {
          coord,
          passable: true,
          data: { ...defaultData },
        });
      }
    }
  }

  return {
    cells,
    layout,
    size: bounds,
  };
}

// Get a cell at a coordinate
export function getCell(grid, coord) {
  const key = hash(coord);
  return grid.cells.get(key) || null;
}

// Set a cell at a coordinate (immutable)
export function setCell(grid, coord, cell) {
  const newCells = new Map(grid.cells);
  const key = hash(coord);
  newCells.set(key, {
    ...cell,
    coord,
  });
  return {
    ...grid,
    cells: newCells,
  };
}

// Update a cell using an updater function (immutable)
export function updateCell(grid, coord, updater) {
  const cell = getCell(grid, coord);
  if (!cell) return grid;

  const newCell = updater(cell);
  return setCell(grid, coord, newCell);
}

// Update a cell's data (immutable)
// Accepts either an object with entities or spread entities as arguments
// Entities with an `id` property are automatically keyed by their id
export function setCellData(grid, coord, ...entities) {
  const cell = getCell(grid, coord);

  if (!cell) return grid;

  if (entities.length === 0) {
    console.warn("setCellData: no data provided");
    return grid;
  }

  // Build the new data object
  const newData = { ...cell.data };

  for (const entity of entities) {
    if (entity === undefined || entity === null) {
      console.warn("setCellData: entity cannot be undefined or null");
      continue;
    }

    // If entity has an id, use it as the key
    if (entity.id) {
      newData[entity.id] = entity;
    } else {
      // Otherwise merge the object directly (for backwards compatibility)
      Object.assign(newData, entity);
    }
  }

  return setCell(grid, coord, { ...cell, data: newData });
}

// Remove a cell from the grid (immutable)
export function removeCell(grid, coord) {
  const newCells = new Map(grid.cells);
  const key = hash(coord);
  newCells.delete(key);
  return {
    ...grid,
    cells: newCells,
  };
}

// Set passability of a cell (immutable)
export function setPassable(grid, coord, passable) {
  return updateCell(grid, coord, (cell) => ({
    ...cell,
    passable,
  }));
}

// Check if a cell is passable
export function isPassable(grid, coord) {
  const cell = getCell(grid, coord);
  return cell ? cell.passable : false;
}

// Get all obstacle coordinates
export function getObstacles(grid) {
  const obstacles = [];
  for (const [key, cell] of grid.cells) {
    if (!cell.passable) {
      obstacles.push(cell.coord);
    }
  }
  return obstacles;
}

// Map over all cells (immutable)
export function mapCells(grid, fn) {
  const newCells = new Map();
  for (const [key, cell] of grid.cells) {
    newCells.set(key, fn(cell));
  }
  return {
    ...grid,
    cells: newCells,
  };
}

// Filter cells by a predicate, returning coordinates
export function filterCells(grid, predicate) {
  const coords = [];
  for (const [key, cell] of grid.cells) {
    if (predicate(cell)) {
      coords.push(cell.coord);
    }
  }
  return coords;
}

// Iterate over all cells
export function forEachCell(grid, fn) {
  for (const [key, cell] of grid.cells) {
    fn(cell);
  }
}

// Check if a coordinate exists in the grid
export function hasCell(grid, coord) {
  const key = hash(coord);
  return grid.cells.has(key);
}
