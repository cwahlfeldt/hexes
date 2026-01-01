// Public API exports for Hexes library

// Grid creation and management
import {
  createGrid,
  getCell,
  setCell,
  setCellData,
  removeCellData,
  updateCell,
  removeCell,
  setPassable,
  isPassable,
  getObstacles,
  mapCells,
  filterCells,
  forEachCell,
  hasCell,
} from "./grid.js";

// Coordinate utilities
import {
  add,
  subtract,
  scale,
  neighbor,
  getDirections,
  equals,
  hash,
  unhash,
  distance,
  lerp,
  round,
  cubeToPixel,
  pixelToCube,
  cubeToOffset,
  offsetToCube,
} from "./coord.js";

// Neighbor and range queries
import {
  getNeighbors,
  getRange,
  getRing,
  getSpiral,
  getReachable,
} from "./neighbors.js";

// Line drawing and line of sight
import { getLine, hasLineOfSight, getVisibleCells } from "./line.js";

// Pathfinding
import { findPath, getPathCost, getPathLength } from "./pathfinding.js";

// Entity queries
import { query, hasComponents } from "./query.js";

// Entity system
import { createEntity, resetIds } from "./entities.js";

// Named exports (for tree-shaking)
export {
  // Grid
  createGrid,
  getCell,
  setCell,
  setCellData,
  removeCellData,
  updateCell,
  removeCell,
  setPassable,
  isPassable,
  getObstacles,
  mapCells,
  filterCells,
  forEachCell,
  hasCell,
  // Coordinates
  add,
  subtract,
  scale,
  neighbor,
  getDirections,
  equals,
  hash,
  unhash,
  distance,
  lerp,
  round,
  cubeToPixel,
  pixelToCube,
  cubeToOffset,
  offsetToCube,
  // Neighbors
  getNeighbors,
  getRange,
  getRing,
  getSpiral,
  getReachable,
  // Line of sight
  getLine,
  hasLineOfSight,
  getVisibleCells,
  // Pathfinding
  findPath,
  getPathCost,
  getPathLength,
  // Query
  query,
  hasComponents,
  // Entities
  createEntity,
  resetIds,
};

// Default export with all functions
const Hexes = {
  // Grid
  createGrid,
  getCell,
  setCell,
  setCellData,
  removeCellData,
  updateCell,
  removeCell,
  setPassable,
  isPassable,
  getObstacles,
  mapCells,
  filterCells,
  forEachCell,
  hasCell,
  // Coordinates
  add,
  subtract,
  scale,
  neighbor,
  getDirections,
  equals,
  hash,
  unhash,
  distance,
  lerp,
  round,
  cubeToPixel,
  pixelToCube,
  cubeToOffset,
  offsetToCube,
  // Neighbors
  getNeighbors,
  getRange,
  getRing,
  getSpiral,
  getReachable,
  // Line of sight
  getLine,
  hasLineOfSight,
  getVisibleCells,
  // Pathfinding
  findPath,
  getPathCost,
  getPathLength,
  // Query
  query,
  hasComponents,
  // Entities
  createEntity,
  resetIds,
};

export default Hexes;
