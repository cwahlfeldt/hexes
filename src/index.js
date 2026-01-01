// Public API exports for Hexes library

// Grid creation and management
export {
  createGrid,
  createHexGrid,
  createCustomGrid,
  getCell,
  setCell,
  setCellData,
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
export {
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
export {
  getNeighbors,
  getRange,
  getRing,
  getSpiral,
  getReachable,
} from "./neighbors.js";

// Line drawing and line of sight
export { getLine, hasLineOfSight, getVisibleCells } from "./line.js";

// Pathfinding
export { findPath, getPathCost, getPathLength } from "./pathfinding.js";
