import { lerp, round, distance } from './coord.js';
import { isPassable, hasCell } from './grid.js';

// Draw a line between two coordinates
export function getLine(coordA, coordB) {
  const dist = distance(coordA, coordB);
  const results = [];

  for (let i = 0; i <= dist; i++) {
    const t = dist === 0 ? 0 : i / dist;
    const interpolated = lerp(coordA, coordB, t);
    results.push(round(interpolated));
  }

  return results;
}

// Check if there's a clear line of sight between two coordinates
export function hasLineOfSight(grid, coordA, coordB) {
  const line = getLine(coordA, coordB);

  for (const coord of line) {
    // If cell doesn't exist in grid, no line of sight
    if (!hasCell(grid, coord)) {
      return false;
    }

    // If cell is not passable, no line of sight
    if (!isPassable(grid, coord)) {
      return false;
    }
  }

  return true;
}

// Get all cells that have line of sight from a given coordinate
export function getVisibleCells(grid, origin, maxRange = Infinity) {
  const visible = [];

  for (const [key, cell] of grid.cells) {
    const dist = distance(origin, cell.coord);
    if (dist > maxRange) continue;

    if (hasLineOfSight(grid, origin, cell.coord)) {
      visible.push(cell.coord);
    }
  }

  return visible;
}
