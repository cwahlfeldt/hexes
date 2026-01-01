/**
 * ECS-style example for hex grid entities
 * Entities have components (properties) and we query by component names
 */

import {
  createGrid,
  setCellData,
  query,
  offsetToCube,
} from "../src/index.js";

// Create a grid
let grid = createGrid(10, 10);

// Helper to get cube coords from col/row
const coord = (col, row) => offsetToCube({ col, row }, "pointy");

// Add a player entity with components
grid = setCellData(grid, coord(0, 0), {
  player: true,           // tag component
  health: 100,
  attack: 15,
  inventory: [],
});

// Add enemies with components
grid = setCellData(grid, coord(2, 1), {
  enemy: true,
  health: 50,
  attack: 10,
  ai: { behavior: "aggressive" },
});

grid = setCellData(grid, coord(3, 2), {
  enemy: true,
  health: 75,
  attack: 12,
  ai: { behavior: "patrol" },
});

// Add items with components
grid = setCellData(grid, coord(1, 0), {
  item: true,
  pickup: true,
  potion: { healAmount: 25 },
});

grid = setCellData(grid, coord(4, 3), {
  item: true,
  pickup: true,
  weapon: { damage: 20 },
});

// ============================================
// Query Examples
// ============================================

// Find all cells with player entities
const players = query(grid, "player");
console.log("Players:", players.length); // 1

// Find all cells with enemy entities
const enemies = query(grid, "enemy");
console.log("Enemies:", enemies.length); // 2

// Find all cells with items
const items = query(grid, "item");
console.log("Items:", items.length); // 2

// Find all entities with health (combatants)
const combatants = query(grid, "health");
console.log("Combatants:", combatants.length); // 3

// Find all entities with health AND attack components
const fighters = query(grid, "health", "attack");
console.log("Fighters:", fighters.length); // 3

// Find all pickupable items
const pickups = query(grid, "pickup");
console.log("Pickups:", pickups.length); // 2

// Find enemies with AI
const aiEnemies = query(grid, "enemy", "ai");
console.log("AI Enemies:", aiEnemies.length); // 2

// Find potions specifically
const potions = query(grid, "potion");
console.log("Potions:", potions.length); // 1

// Find weapons
const weapons = query(grid, "weapon");
console.log("Weapons:", weapons.length); // 1

// ============================================
// Working with query results
// ============================================

// Get player data
const playerCell = players[0];
console.log("Player health:", playerCell.data.health); // 100
console.log("Player coord:", playerCell.coord); // { x: 0, y: 0, z: 0 }

// Iterate over enemies
enemies.forEach((cell) => {
  console.log(`Enemy at ${cell.coord.x},${cell.coord.z} has ${cell.data.health} HP`);
});

// Damage all enemies
enemies.forEach((cell) => {
  grid = setCellData(grid, cell.coord, {
    ...cell.data,
    health: cell.data.health - 10,
  });
});

// Query again to see updated health
const updatedEnemies = query(grid, "enemy");
updatedEnemies.forEach((cell) => {
  console.log(`Enemy now has ${cell.data.health} HP`);
});
