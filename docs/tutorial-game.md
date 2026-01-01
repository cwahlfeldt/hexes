# Tutorial: Building a Simple Tactical Game

In this tutorial, we'll build a simple turn-based tactical game where units move across a hex grid, avoiding obstacles and finding optimal paths.

## What We'll Build

- A hex grid battlefield
- Player and enemy units
- Movement with pathfinding
- Turn-based mechanics
- Attack range visualization

## Step 1: Set Up the Grid

First, let's create our battlefield:

```javascript
import { createHexGrid, setPassable } from 'hexes';

// Create a hexagonal battlefield with radius 5
let battlefield = createHexGrid(5, { layout: 'pointy' });

// Add some obstacles (mountains, walls, etc.)
const obstacles = [
  { x: 1, y: -1, z: 0 },
  { x: 2, y: -2, z: 0 },
  { x: -1, y: 1, z: 0 }
];

obstacles.forEach(coord => {
  battlefield = setPassable(battlefield, coord, false);
});
```

## Step 2: Add Units

Let's track units separately from the grid:

```javascript
const units = {
  player: {
    id: 'player',
    position: { x: -2, y: 2, z: 0 },
    hp: 100,
    movement: 3,
    attackRange: 2,
    team: 'player'
  },
  enemy1: {
    id: 'enemy1',
    position: { x: 2, y: -2, z: 0 },
    hp: 80,
    movement: 2,
    attackRange: 1,
    team: 'enemy'
  }
};
```

## Step 3: Calculate Movement Range

```javascript
import { getReachable } from 'hexes';

function getMovementRange(grid, unit) {
  // Get all cells the unit can reach
  return getReachable(grid, unit.position, unit.movement);
}

// Show where player can move
const playerMoves = getMovementRange(battlefield, units.player);
console.log('Player can move to', playerMoves.length, 'cells');
```

## Step 4: Move a Unit

```javascript
import { findPath } from 'hexes';

function moveUnit(grid, unit, destination) {
  // Check if destination is within range
  const reachable = getReachable(grid, unit.position, unit.movement);
  const canReach = reachable.some(
    coord => coord.x === destination.x &&
             coord.y === destination.y &&
             coord.z === destination.z
  );

  if (!canReach) {
    console.log('Destination too far!');
    return null;
  }

  // Find the path
  const path = findPath(grid, unit.position, destination);

  if (!path) {
    console.log('No path available!');
    return null;
  }

  // Move the unit
  unit.position = destination;
  return path;
}

// Move player to a new position
const destination = { x: 0, y: 0, z: 0 };
const path = moveUnit(battlefield, units.player, destination);

if (path) {
  console.log('Moving along path:', path);
  // Animate unit along path in your renderer
}
```

## Step 5: Show Attack Range

```javascript
import { getRange, distance } from 'hexes';

function getAttackTargets(grid, attacker, units) {
  // Get all cells in attack range
  const inRange = getRange(grid, attacker.position, attacker.attackRange);

  // Find enemy units in range
  const targets = [];
  Object.values(units).forEach(unit => {
    if (unit.team !== attacker.team) {
      const dist = distance(attacker.position, unit.position);
      if (dist <= attacker.attackRange) {
        targets.push(unit);
      }
    }
  });

  return targets;
}

// Check who player can attack
const targets = getAttackTargets(battlefield, units.player, units);
console.log('Can attack:', targets.map(t => t.id));
```

## Step 6: Line of Sight for Attacks

```javascript
import { hasLineOfSight } from 'hexes';

function canAttack(grid, attacker, target) {
  // Check distance
  const dist = distance(attacker.position, target.position);
  if (dist > attacker.attackRange) {
    return false;
  }

  // Check line of sight
  return hasLineOfSight(grid, attacker.position, target.position);
}

// Check if player can attack enemy1
if (canAttack(battlefield, units.player, units.enemy1)) {
  console.log('Clear shot!');
} else {
  console.log('No line of sight');
}
```

## Step 7: Turn System

```javascript
class TurnManager {
  constructor() {
    this.currentTeam = 'player';
    this.turnNumber = 1;
  }

  endTurn() {
    this.currentTeam = this.currentTeam === 'player' ? 'enemy' : 'player';

    if (this.currentTeam === 'player') {
      this.turnNumber++;
    }

    console.log(`Turn ${this.turnNumber} - ${this.currentTeam}'s turn`);
  }

  canAct(unit) {
    return unit.team === this.currentTeam;
  }
}

const turnManager = new TurnManager();

// Player's turn
if (turnManager.canAct(units.player)) {
  const destination = { x: 1, y: 0, z: -1 };
  moveUnit(battlefield, units.player, destination);
}

// End turn
turnManager.endTurn();
```

## Step 8: Combat System

```javascript
function attack(attacker, target) {
  const damage = calculateDamage(attacker, target);
  target.hp -= damage;

  console.log(`${attacker.id} attacks ${target.id} for ${damage} damage!`);

  if (target.hp <= 0) {
    console.log(`${target.id} is defeated!`);
    return true; // Unit defeated
  }

  return false;
}

function calculateDamage(attacker, target) {
  // Simple damage calculation
  const baseDamage = 20;
  const randomFactor = Math.random() * 10;
  return Math.floor(baseDamage + randomFactor);
}

// Player attacks enemy
if (canAttack(battlefield, units.player, units.enemy1)) {
  attack(units.player, units.enemy1);
}
```

## Step 9: Putting It All Together

```javascript
class HexGame {
  constructor() {
    this.grid = createHexGrid(5, { layout: 'pointy' });
    this.units = {};
    this.turnManager = new TurnManager();
    this.selectedUnit = null;
  }

  addObstacle(coord) {
    this.grid = setPassable(this.grid, coord, false);
  }

  addUnit(id, unitData) {
    this.units[id] = unitData;
  }

  selectUnit(unitId) {
    const unit = this.units[unitId];
    if (!this.turnManager.canAct(unit)) {
      console.log('Not this unit\'s turn!');
      return null;
    }

    this.selectedUnit = unit;
    return getMovementRange(this.grid, unit);
  }

  moveSelectedUnit(destination) {
    if (!this.selectedUnit) return;

    const path = moveUnit(this.grid, this.selectedUnit, destination);
    this.selectedUnit = null;
    return path;
  }

  attackWithUnit(attackerId, targetId) {
    const attacker = this.units[attackerId];
    const target = this.units[targetId];

    if (!this.turnManager.canAct(attacker)) {
      console.log('Not your turn!');
      return false;
    }

    if (!canAttack(this.grid, attacker, target)) {
      console.log('Cannot attack target!');
      return false;
    }

    const defeated = attack(attacker, target);

    if (defeated) {
      delete this.units[targetId];
    }

    return true;
  }

  endTurn() {
    this.turnManager.endTurn();
  }
}

// Usage
const game = new HexGame();

// Set up battlefield
game.addObstacle({ x: 1, y: -1, z: 0 });
game.addObstacle({ x: 2, y: -2, z: 0 });

// Add units
game.addUnit('player', {
  id: 'player',
  position: { x: -2, y: 2, z: 0 },
  hp: 100,
  movement: 3,
  attackRange: 2,
  team: 'player'
});

game.addUnit('enemy1', {
  id: 'enemy1',
  position: { x: 2, y: -2, z: 0 },
  hp: 80,
  movement: 2,
  attackRange: 1,
  team: 'enemy'
});

// Play a turn
const movementRange = game.selectUnit('player');
console.log('Can move to:', movementRange);

game.moveSelectedUnit({ x: 0, y: 0, z: 0 });
game.attackWithUnit('player', 'enemy1');
game.endTurn();
```

## Step 10: Add Rendering (Example with Canvas)

```javascript
function renderGrid(canvas, grid, units, movementRange = []) {
  const ctx = canvas.getContext('2d');
  const hexSize = 30;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw hexes
  grid.cells.forEach((cell) => {
    const pixel = cubeToPixel(cell.coord, grid.layout, hexSize);
    const center = {
      x: pixel.x + canvas.width / 2,
      y: pixel.y + canvas.height / 2
    };

    // Determine color
    let color = '#2d4059'; // Default

    if (!cell.passable) {
      color = '#ea5455'; // Obstacle
    } else if (movementRange.some(c =>
      c.x === cell.coord.x && c.y === cell.coord.y && c.z === cell.coord.z
    )) {
      color = '#4facfe'; // Movement range
    }

    drawHex(ctx, center, hexSize, color, grid.layout);
  });

  // Draw units
  Object.values(units).forEach(unit => {
    const pixel = cubeToPixel(unit.position, grid.layout, hexSize);
    const center = {
      x: pixel.x + canvas.width / 2,
      y: pixel.y + canvas.height / 2
    };

    ctx.fillStyle = unit.team === 'player' ? '#00ff00' : '#ff0000';
    ctx.beginPath();
    ctx.arc(center.x, center.y, hexSize / 2, 0, Math.PI * 2);
    ctx.fill();
  });
}
```

## Next Steps

Enhance your game with:

- **Terrain types** - Different movement costs (water, forest, etc.)
- **Abilities** - Special unit powers with custom ranges
- **FOW (Fog of War)** - Use `getVisibleCells()` for vision
- **AI opponents** - Use `findPath()` for enemy movement
- **Multiple unit types** - Different stats and abilities

Check out the [API Reference](./api-reference.md) for more features!
