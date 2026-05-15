import { getDirections, add, hash } from './coord.js';
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
// Uses mathematical coordinate generation instead of scanning the entire grid
export function getRange(grid, coord, range) {
  const results = [];

  for (let dx = -range; dx <= range; dx++) {
    const minDy = Math.max(-range, -dx - range);
    const maxDy = Math.min(range, -dx + range);
    for (let dy = minDy; dy <= maxDy; dy++) {
      const dz = -dx - dy;
      const target = { x: coord.x + dx, y: coord.y + dy, z: coord.z + dz };
      if (hasCell(grid, target)) {
        results.push(target);
      }
    }
  }

  return results;
}

// Get all cells exactly at a certain distance (ring)
// Uses mathematical coordinate generation - walks around the ring
export function getRing(grid, coord, radius) {
  if (radius === 0) {
    return hasCell(grid, coord) ? [coord] : [];
  }

  const results = [];
  const directions = getDirections();

  // Start at coord + direction[4] * radius (bottom-left corner of ring)
  let current = {
    x: coord.x + directions[4].x * radius,
    y: coord.y + directions[4].y * radius,
    z: coord.z + directions[4].z * radius
  };

  // Walk around the ring: 6 sides, radius steps each
  for (let side = 0; side < 6; side++) {
    for (let step = 0; step < radius; step++) {
      if (hasCell(grid, current)) {
        results.push(current);
      }
      current = add(current, directions[side]);
    }
  }

  return results;
}

// Get cells in a spiral pattern starting from center
export function getSpiral(grid, center, maxRadius) {
  const results = hasCell(grid, center) ? [center] : [];
  const directions = getDirections();

  for (let radius = 1; radius <= maxRadius; radius++) {
    // Walk around each ring directly instead of calling getRing
    let current = {
      x: center.x + directions[4].x * radius,
      y: center.y + directions[4].y * radius,
      z: center.z + directions[4].z * radius
    };

    for (let side = 0; side < 6; side++) {
      for (let step = 0; step < radius; step++) {
        if (hasCell(grid, current)) {
          results.push(current);
        }
        current = add(current, directions[side]);
      }
    }
  }

  return results;
}

// Get reachable cells within range (considering passability)
export function getReachable(grid, start, maxDistance) {
  const visited = new Set();
  const results = [start];
  visited.add(hash(start));

  let currentFringe = [start];

  for (let k = 1; k <= maxDistance && currentFringe.length > 0; k++) {
    const nextFringe = [];
    for (const coord of currentFringe) {
      const neighbors = getNeighbors(grid, coord, { passableOnly: true });
      for (const neighbor of neighbors) {
        const key = hash(neighbor);
        if (!visited.has(key)) {
          visited.add(key);
          results.push(neighbor);
          nextFringe.push(neighbor);
        }
      }
    }
    currentFringe = nextFringe;
  }

  return results;
}
