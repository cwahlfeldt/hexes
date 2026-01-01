import { getDirections, add, distance, hash } from './coord.js';
import { hasCell, isPassable } from './grid.js';

// Get all neighboring coordinates (up to 6)
export function getNeighbors(grid, coord, options = {}) {
  const { passableOnly = false } = options;
  const directions = getDirections();
  const neighbors = [];

  for (const direction of directions) {
    const neighbor = add(coord, direction);

    if (!hasCell(grid, neighbor)) continue;

    if (passableOnly && !isPassable(grid, neighbor)) continue;

    neighbors.push(neighbor);
  }

  return neighbors;
}

// Get all cells within a certain range (distance)
export function getRange(grid, coord, range) {
  const results = [];

  for (const [key, cell] of grid.cells) {
    const dist = distance(coord, cell.coord);
    if (dist <= range) {
      results.push(cell.coord);
    }
  }

  return results;
}

// Get all cells exactly at a certain distance (ring)
export function getRing(grid, coord, radius) {
  const results = [];

  for (const [key, cell] of grid.cells) {
    const dist = distance(coord, cell.coord);
    if (dist === radius) {
      results.push(cell.coord);
    }
  }

  return results;
}

// Get cells in a spiral pattern starting from center
export function getSpiral(grid, center, maxRadius) {
  const results = [center];

  for (let radius = 1; radius <= maxRadius; radius++) {
    const ring = getRing(grid, center, radius);
    results.push(...ring);
  }

  return results;
}

// Get reachable cells within range (considering passability)
export function getReachable(grid, start, maxDistance) {
  const visited = new Set();
  const fringes = [[start]];
  visited.add(hash(start));

  for (let k = 1; k <= maxDistance; k++) {
    fringes.push([]);
    for (const coord of fringes[k - 1]) {
      const neighbors = getNeighbors(grid, coord, { passableOnly: true });
      for (const neighbor of neighbors) {
        const key = hash(neighbor);
        if (!visited.has(key)) {
          visited.add(key);
          fringes[k].push(neighbor);
        }
      }
    }
  }

  const results = [];
  for (const fringe of fringes) {
    results.push(...fringe);
  }

  return results;
}
