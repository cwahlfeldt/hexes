import Hexes from "../../../src/index.js";

export function movementSystem(state) {
  const { grid, selectedCell } = state;
  if (!selectedCell) return state;

  const playerResults = Hexes.query(grid, "player");
  if (playerResults.length === 0) return state;
  const [[playerCell, player]] = playerResults;

  const path = Hexes.findPath(grid, playerCell.coord, selectedCell);
  if (!path || path.length <= 1) return state;

  const previousPlayerCoord = playerCell.coord;
  const playerDest = path[Math.min(player.moveRange, path.length - 1)];
  let newGrid = Hexes.moveCellData(grid, playerCell.coord, playerDest, player);

  // Check if enemy should move or attack
  const enemyResults = Hexes.query(newGrid, "enemy");
  if (enemyResults.length === 0) {
    return { ...state, grid: newGrid, previousPlayerCoord };
  }

  const [[enemyCell, enemy]] = enemyResults;
  const enemyNeighbors = Hexes.getNeighbors(newGrid, enemyCell.coord);

  // Check if player just moved into enemy's range
  const playerNowAdjacent = enemyNeighbors.some(
    (coord) =>
      coord.x === playerDest.x &&
      coord.y === playerDest.y &&
      coord.z === playerDest.z
  );

  const wasAdjacentBefore = enemyNeighbors.some(
    (coord) =>
      coord.x === previousPlayerCoord.x &&
      coord.y === previousPlayerCoord.y &&
      coord.z === previousPlayerCoord.z
  );

  // Enemy doesn't move if player entered its range (it attacks instead)
  if (playerNowAdjacent && !wasAdjacentBefore) {
    return { ...state, grid: newGrid, previousPlayerCoord };
  }

  // Otherwise enemy moves toward player
  const enemyPath = Hexes.findPath(newGrid, enemyCell.coord, playerDest);
  if (!enemyPath || enemyPath.length <= 1) {
    return { ...state, grid: newGrid, previousPlayerCoord };
  }

  const enemyDest = enemyPath[Math.min(enemy.moveRange, enemyPath.length - 1)];
  newGrid = Hexes.moveCellData(newGrid, enemyCell.coord, enemyDest, enemy);

  return { ...state, grid: newGrid, previousPlayerCoord };
}
