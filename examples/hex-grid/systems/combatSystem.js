import Hexes from "../../../src/index.js";

export function combatSystem(state) {
  const { grid, previousPlayerCoord } = state;

  const playerResults = Hexes.query(grid, "player");
  const enemyResults = Hexes.query(grid, "enemy");

  if (playerResults.length === 0 || enemyResults.length === 0) return state;

  const [[playerCell, player]] = playerResults;
  const [[enemyCell, enemy]] = enemyResults;

  const enemyNeighbors = Hexes.getNeighbors(grid, enemyCell.coord);

  const playerIsAdjacentToEnemy = enemyNeighbors.some(
    (coord) =>
      coord.x === playerCell.coord.x &&
      coord.y === playerCell.coord.y &&
      coord.z === playerCell.coord.z
  );

  const wasAdjacentBefore =
    previousPlayerCoord &&
    enemyNeighbors.some(
      (coord) =>
        coord.x === previousPlayerCoord.x &&
        coord.y === previousPlayerCoord.y &&
        coord.z === previousPlayerCoord.z
    );

  // Player moved to a cell that is adjacent to both previous position and enemy
  const movedToSharedNeighbor =
    previousPlayerCoord &&
    wasAdjacentBefore &&
    enemyNeighbors.some(
      (coord) =>
        coord.x === playerCell.coord.x &&
        coord.y === playerCell.coord.y &&
        coord.z === playerCell.coord.z
    );

  console.log("Combat check:", {
    previousPlayerCoord,
    currentPlayerCoord: playerCell.coord,
    enemyCoord: enemyCell.coord,
    wasAdjacentBefore,
    playerIsAdjacentToEnemy,
    movedToSharedNeighbor,
  });

  let newGrid = grid;

  // Enemy attacks: player moved into enemy's range (wasn't adjacent, now is)
  if (playerIsAdjacentToEnemy && !wasAdjacentBefore) {
    const newPlayerHealth = player.health - enemy.attackDamage;

    if (newPlayerHealth <= 0) {
      newGrid = Hexes.removeCellData(newGrid, playerCell.coord, player);
    } else {
      newGrid = Hexes.setCellData(newGrid, playerCell.coord, {
        ...player,
        health: newPlayerHealth,
      });
    }
  }

  // Player attacks: was adjacent and moved to shared neighbor
  if (movedToSharedNeighbor) {
    const newEnemyHealth = enemy.health - player.attackDamage;

    if (newEnemyHealth <= 0) {
      newGrid = Hexes.removeCellData(newGrid, enemyCell.coord, enemy);
    } else {
      newGrid = Hexes.setCellData(newGrid, enemyCell.coord, {
        ...enemy,
        health: newEnemyHealth,
      });
    }
  }

  return { ...state, grid: newGrid };
}
