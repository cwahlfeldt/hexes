/**
 * Game logic for hex grid example
 * Handles grid state and entity movement
 */
import Hexes from "../../src/index.js";

/**
 * Initialize the game state
 * @returns {Object} Initial game state with grid and player
 */
export function initGame() {
  // Create a hex-shaped grid with radius 3
  let grid = Hexes.createGrid({
    type: 'hex',
    radius: 3,
    layout: "pointy"
  });

  // Create a player entity at the center
  const player = Hexes.createEntity({
    type: "player",
    color: "#4CAF50",
  });

  // Place player at center of grid
  grid = Hexes.setCellData(grid, { x: 0, y: 0, z: 0 }, player);

  return {
    grid,
    player,
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
  const results = Hexes.query(grid, "id").filter(
    (e) => e[1].id === entity.id
  );

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
 * Move player in a direction using keyboard input
 * @param {Object} gameState - Current game state
 * @param {string} direction - Direction to move ('w', 'a', 's', 'd', 'q', 'e')
 * @returns {Object} Updated game state
 */
export function movePlayerByKey(gameState, direction) {
  const { grid, player } = gameState;
  const currentPos = findEntityPosition(grid, player);

  if (!currentPos) {
    return gameState;
  }

  // Map keyboard keys to hex directions
  // Using cube coordinate directions
  const directionMap = {
    'w': { x: 0, y: -1, z: 1 },   // North
    's': { x: 0, y: 1, z: -1 },   // South
    'q': { x: -1, y: 0, z: 1 },   // Northwest
    'e': { x: 1, y: -1, z: 0 },   // Northeast
    'a': { x: -1, y: 1, z: 0 },   // Southwest
    'd': { x: 1, y: 0, z: -1 },   // Southeast
  };

  const dir = directionMap[direction.toLowerCase()];
  if (!dir) {
    return gameState;
  }

  // Calculate new position
  const newPos = Hexes.add(currentPos, dir);

  // Move the player
  const newGrid = moveEntity(grid, player, newPos);

  return {
    ...gameState,
    grid: newGrid,
  };
}

/**
 * Get all cells in the grid as an array
 * @param {Object} grid - The hex grid
 * @returns {Array} Array of cells
 */
export function getAllCells(grid) {
  return Array.from(grid.cells.values());
}
