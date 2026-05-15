import { distance, hash, equals } from './coord.js';
import { getNeighbors } from './neighbors.js';

// Priority Queue implementation using binary min-heap
class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  enqueue(item, priority) {
    this.heap.push({ item, priority });
    this._bubbleUp(this.heap.length - 1);
  }

  dequeue() {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop().item;

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._bubbleDown(0);
    return min.item;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parentIndex = (index - 1) >> 1;
      if (this.heap[parentIndex].priority <= this.heap[index].priority) break;
      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      index = parentIndex;
    }
  }

  _bubbleDown(index) {
    const length = this.heap.length;
    while (true) {
      const leftChild = (index << 1) + 1;
      const rightChild = leftChild + 1;
      let smallest = index;

      if (leftChild < length && this.heap[leftChild].priority < this.heap[smallest].priority) {
        smallest = leftChild;
      }
      if (rightChild < length && this.heap[rightChild].priority < this.heap[smallest].priority) {
        smallest = rightChild;
      }
      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
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
    path.push(current);
    const currentKey = hash(current);

    if (currentKey === startKey) {
      break;
    }

    current = cameFrom.get(currentKey);
  }

  path.reverse();
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
