# Understanding Hex Coordinates

Hexes uses **cube coordinates** for hex grids. This guide explains why and how to use them effectively.

## Why Cube Coordinates?

Cube coordinates make hex math simple and elegant. The key insight: **hex grids are 2D slices of a 3D cube**.

### The Golden Rule

In cube coordinates, coordinates always satisfy:

```
x + y + z = 0
```

This constraint means you only need 2 values (the third is implied), but keeping all 3 makes math easier.

## Visual Guide

### Pointy-Top Layout (⬡)

```
        (0,1,-1)
       /        \
  (-1,1,0)  (0,0,0)  (1,0,-1)
       \        /
        (0,-1,1)
```

### Flat-Top Layout (⬢)

```
    (-1,1,0)  (0,1,-1)
         \    /
         (0,0,0)
         /    \
    (-1,0,1)  (0,-1,1)
```

## Basic Operations

### Adding Coordinates

To move in a direction, just add the direction vector:

```javascript
import { add } from 'hexes';

const start = { x: 0, y: 0, z: 0 };
const right = { x: 1, y: -1, z: 0 };

const result = add(start, right);
// { x: 1, y: -1, z: 0 }
```

### Distance

Distance is half the sum of absolute differences:

```javascript
import { distance } from 'hexes';

const a = { x: 0, y: 0, z: 0 };
const b = { x: 3, y: -2, z: -1 };

const dist = distance(a, b);
// 3 steps
```

Why it works:
```
|0 - 3| + |0 - (-2)| + |0 - (-1)| = 3 + 2 + 1 = 6
6 / 2 = 3
```

### Direction Vectors

The 6 hex directions (pointy-top):

```javascript
const directions = [
  { x: 1, y: -1, z: 0 },  // East
  { x: 1, y: 0, z: -1 },  // Northeast
  { x: 0, y: 1, z: -1 },  // Northwest
  { x: -1, y: 1, z: 0 },  // West
  { x: -1, y: 0, z: 1 },  // Southwest
  { x: 0, y: -1, z: 1 }   // Southeast
];
```

## Common Patterns

### Getting All Neighbors

```javascript
import { getNeighbors } from 'hexes';

const neighbors = getNeighbors(grid, { x: 0, y: 0, z: 0 });
// Returns up to 6 neighboring coordinates
```

### Iterating a Ring

Get all hexes at exactly distance N:

```javascript
import { getRing } from 'hexes';

const ring = getRing(grid, center, 2);
// All hexes exactly 2 steps away
```

### Iterating a Range

Get all hexes within distance N:

```javascript
import { getRange } from 'hexes';

const inRange = getRange(grid, center, 3);
// All hexes 0-3 steps away
```

### Drawing a Line

```javascript
import { getLine } from 'hexes';

const line = getLine(start, end);
// All hexes in a straight line
```

## Coordinate Systems Comparison

### Cube Coordinates (Used by Hexes)

```javascript
{ x: 1, y: -1, z: 0 }
```

**Pros:**
- Simple distance calculation
- Easy neighbor lookup
- Symmetric in all directions
- Math operations are intuitive

**Cons:**
- Redundant (3 values for 2D)
- Must maintain x + y + z = 0

### Offset Coordinates (Common in Games)

```javascript
{ col: 1, row: 0 }
```

**Pros:**
- Maps directly to 2D arrays
- Compact (only 2 values)

**Cons:**
- Distance calculation is complex
- Different formulas for odd/even columns
- Hard to work with mathematically

### Converting Between Systems

```javascript
import { cubeToOffset, offsetToCube } from 'hexes';

// Cube to offset
const offset = cubeToOffset({ x: 1, y: -1, z: 0 }, 'pointy');
// { col: 1, row: 0 }

// Offset to cube
const cube = offsetToCube({ col: 1, row: 0 }, 'pointy');
// { x: 1, y: -1, z: 0 }
```

## Pixel Coordinates

For rendering, convert to pixel coordinates:

```javascript
import { cubeToPixel, pixelToCube } from 'hexes';

const hexSize = 32;

// Cube to pixel
const pixel = cubeToPixel({ x: 1, y: -1, z: 0 }, 'pointy', hexSize);
// { x: 55.4, y: 0 }

// Pixel to cube (useful for mouse clicks)
const cube = pixelToCube({ x: 55.4, y: 0 }, 'pointy', hexSize);
// { x: 1, y: -1, z: 0 }
```

## Advanced: Rotation and Reflection

### Rotating 60° clockwise

```javascript
function rotateClockwise(coord) {
  return { x: -coord.z, y: -coord.x, z: -coord.y };
}
```

### Reflecting across vertical axis

```javascript
function reflectVertical(coord) {
  return { x: coord.x, y: coord.z, z: coord.y };
}
```

## Tips for Working with Coordinates

1. **Always validate** that x + y + z = 0
2. **Use the library functions** instead of manual math
3. **Think in directions** - movement is just addition
4. **Convert once** - work in cube, convert to pixel/offset only when needed
5. **Test symmetry** - operations should work the same in all 6 directions

## Common Mistakes

### ❌ Treating hexes like squares

```javascript
// Wrong - this doesn't work for hexes
const neighbor = { x: coord.x + 1, y: coord.y };
```

```javascript
// Right - use direction vectors
const neighbor = add(coord, { x: 1, y: -1, z: 0 });
```

### ❌ Breaking the constraint

```javascript
// Wrong - doesn't satisfy x + y + z = 0
const coord = { x: 1, y: 1, z: 1 }; // Sum = 3, not 0!
```

```javascript
// Right
const coord = { x: 1, y: -1, z: 0 }; // Sum = 0 ✓
```

### ❌ Calculating distance wrong

```javascript
// Wrong - Euclidean distance
const dist = Math.sqrt(dx*dx + dy*dy);
```

```javascript
// Right - use the library
import { distance } from 'hexes';
const dist = distance(coordA, coordB);
```

## Further Reading

- [Red Blob Games - Hexagonal Grids](https://www.redblobgames.com/grids/hexagons/) - Excellent visual guide
- [Tutorial: Building a Game](./tutorial-game.md) - Practical examples
- [API Reference](./api-reference.md) - All coordinate functions
