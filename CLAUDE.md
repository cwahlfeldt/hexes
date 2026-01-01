# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hexes is a functional, immutable hex grid library in pure JavaScript with built-in pathfinding. It uses ES modules and has zero dependencies.

## Development

This is a pure ES module library. There is no build step or test suite configured yet.

To run the example:
```bash
# Serve the examples directory with any static server
npx serve .
# Then open http://localhost:3000/examples/index.html
```

## Architecture

The library is organized into focused modules that export pure functions:

- **src/index.js** - Public API, re-exports all functions from other modules
- **src/grid.js** - Grid creation (`createGrid`, `createHexGrid`, `createCustomGrid`) and cell operations (`getCell`, `setCell`, `setCellData`, `removeCellData`)
- **src/coord.js** - Cube coordinate math (`add`, `subtract`, `distance`) and conversions between cube/offset/pixel coordinates
- **src/neighbors.js** - Neighbor queries (`getNeighbors`, `getRange`, `getRing`, `getSpiral`, `getReachable`)
- **src/line.js** - Line drawing and line of sight (`getLine`, `hasLineOfSight`, `getVisibleCells`)
- **src/pathfinding.js** - A* pathfinding (`findPath`, `getPathCost`, `getPathLength`)
- **src/entities.js** - Simple entity factory with auto-incrementing IDs
- **src/query.js** - ECS-style queries to find entities by components

## Key Concepts

**Cube Coordinates**: All positions use cube coordinates `{x, y, z}` where `x + y + z = 0`. Coordinates are hashed to strings (`"x,y,z"`) for Map keys.

**Immutability**: All grid operations return new grid objects. The grid stores cells in a `Map` keyed by coordinate hash.

**Entity System**: Entities are plain objects with an `id` property created via `create()`. They're stored in `cell.data` keyed by their ID. Use `query(grid, ...components)` to find cells containing entities with specific component properties.

**Cell Structure**:
```javascript
{
  coord: { x, y, z },
  passable: true,
  data: { [entityId]: entity, ... }
}
```

**Grid Structure**:
```javascript
{
  cells: Map<string, Cell>,
  layout: 'pointy' | 'flat',
  size: { width, height } | { radius }
}
```
