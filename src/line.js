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

  // If maxRange is finite, only check cells within range instead of scanning entire grid
  if (maxRange !== Infinity) {
    for (let dx = -maxRange; dx <= maxRange; dx++) {
      const minDy = Math.max(-maxRange, -dx - maxRange);
      const maxDy = Math.min(maxRange, -dx + maxRange);
      for (let dy = minDy; dy <= maxDy; dy++) {
        const dz = -dx - dy;
        const target = { x: origin.x + dx, y: origin.y + dy, z: origin.z + dz };
        if (hasCell(grid, target) && hasLineOfSight(grid, origin, target)) {
          visible.push(target);
        }
      }
    }
  } else {
    // No range limit - must scan all cells
    for (const [key, cell] of grid.cells) {
      if (hasLineOfSight(grid, origin, cell.coord)) {
        visible.push(cell.coord);
      }
    }
  }

  return visible;
}
