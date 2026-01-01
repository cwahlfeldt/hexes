import { distance, hash, equals } from './coord.js';
import { getNeighbors } from './neighbors.js';

// Priority Queue implementation using min-heap
class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(item, priority) {
    this.items.push({ item, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.items.shift()?.item;
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

// Default heuristic: hex distance
function defaultHeuristic(a, b) {
  return distance(a, b);
}

// Default cost function: always 1
function defaultCostFn(from, to) {
  return 1;
}

// A* pathfinding algorithm
export function findPath(grid, start, end, options = {}) {
  const { heuristic = defaultHeuristic, costFn = defaultCostFn } = options;

  // Early exit if start equals end
  if (equals(start, end)) {
    return [start];
  }

  const frontier = new PriorityQueue();
  frontier.enqueue(start, 0);

  const cameFrom = new Map();
  const costSoFar = new Map();

  const startKey = hash(start);
  const endKey = hash(end);

  cameFrom.set(startKey, null);
  costSoFar.set(startKey, 0);

  while (!frontier.isEmpty()) {
    const current = frontier.dequeue();
    const currentKey = hash(current);

    // Early termination: found the goal
    if (currentKey === endKey) {
      return reconstructPath(cameFrom, start, end);
    }

    const neighbors = getNeighbors(grid, current, { passableOnly: true });

    for (const next of neighbors) {
      const nextKey = hash(next);
      const newCost = costSoFar.get(currentKey) + costFn(current, next);

      if (!costSoFar.has(nextKey) || newCost < costSoFar.get(nextKey)) {
        costSoFar.set(nextKey, newCost);
        const priority = newCost + heuristic(next, end);
        frontier.enqueue(next, priority);
        cameFrom.set(nextKey, current);
      }
    }
  }

  // No path found
  return null;
}

// Reconstruct path from cameFrom map
function reconstructPath(cameFrom, start, end) {
  const path = [];
  let current = end;
  const startKey = hash(start);

  while (current) {
    path.unshift(current);
    const currentKey = hash(current);

    if (currentKey === startKey) {
      break;
    }

    current = cameFrom.get(currentKey);
  }

  return path;
}

// Calculate the cost of a path
export function getPathCost(path, costFn = defaultCostFn) {
  let totalCost = 0;

  for (let i = 0; i < path.length - 1; i++) {
    totalCost += costFn(path[i], path[i + 1]);
  }

  return totalCost;
}

// Get the length of a path
export function getPathLength(path) {
  return path ? path.length : 0;
}
