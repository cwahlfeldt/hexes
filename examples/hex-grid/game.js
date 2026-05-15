/**
 * Game logic for hex grid example
 * Handles grid state and entity movement
 */
import Hexes, { isPassable } from "../../src/index.js";

/**
 * Initialize the game state
 * @returns {Object} Initial game state with grid and player
 */
export function initGame() {
  // Create a hex-shaped grid with radius 3
  let grid = Hexes.createGrid({
    type: "hex",
    radius: 4,
    layout: "flat",
  });

  // add hex entity to all passable cells
  grid.cells.forEach((cell) => {
    if (!cell.passable) return;

    const hex = Hexes.createEntity({
      type: "hex",
      hex: true,
      passable: true,
      fillColor: "#f0f0f0",
    });

    grid = Hexes.setCellData(grid, cell.coord, hex);
  });

  // Create a player entity at the center
  const player = Hexes.createEntity({
    player: true,
    health: 3,
    moveRange: 1,
    attackDamage: 1,
    attackRange: 1,
    color: "#4CAF50",
  });

  const enemy = Hexes.createEntity({
    health: 3,
    enemy: true,
    moveRange: 1,
    attackDamage: 1,
    attackRange: 1,
    color: "red",
  });

  // Place player at center of grid
  grid = Hexes.setCellData(grid, { x: 0, y: 0, z: 0 }, player);
  grid = Hexes.setCellData(grid, { x: 3, y: 0, z: -3 }, enemy);

  return {
    grid,
    selectedCell: null,
  };
}

/**
 * Find the current position of an entity in the grid
 * @param {Object} grid - The hex grid
 * @param {Object} entity - The entity to find
 * @returns {Object|null} The coordinate of the entity or null
 */
export function findEntityPosition(grid, entity) {
  const results = Hexes.query(grid, "id").filter((e) => e[1].id === entity.id);

  if (results.length > 0) {
    return results[0][0].coord;
  }

  return null;
}

/**
 * Move an entity to a new position
 * @param {Object} grid - The hex grid
 * @param {Object} entity - The entity to move
 * @param {Object} destination - The destination coordinate
 * @returns {Object} Updated grid
 */
export function moveEntity(grid, entity, destination) {
  // Check if destination exists in the grid
  const destCell = Hexes.getCell(grid, destination);
  if (!destCell) {
    return grid;
  }

  // Find current position
  const currentPos = findEntityPosition(grid, entity);
  if (!currentPos) {
    return grid;
  }

  // Remove entity from current position
  let newGrid = Hexes.removeCellData(grid, currentPos, entity);

  // Add entity to new position
  newGrid = Hexes.setCellData(newGrid, destination, entity);

  return newGrid;
}

/**
 * Get all cells in the grid as an array
 * @param {Object} grid - The hex grid
 * @returns {Array} Array of cells
 */
export function getAllCells(grid) {
  return Array.from(grid.cells.values());
}
