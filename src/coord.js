// Coordinate utilities for cube coordinates
// In cube coordinates: x + y + z = 0

// Direction vectors for hex neighbors
const DIRECTIONS = [
  { x: 1, y: -1, z: 0 },
  { x: 1, y: 0, z: -1 },
  { x: 0, y: 1, z: -1 },
  { x: -1, y: 1, z: 0 },
  { x: -1, y: 0, z: 1 },
  { x: 0, y: -1, z: 1 },
];

// Coordinate math operations
export function add(a, b) {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function subtract(a, b) {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

export function scale(coord, factor) {
  return { x: coord.x * factor, y: coord.y * factor, z: coord.z * factor };
}

// Get neighbor in a specific direction (0-5)
export function neighbor(coord, direction) {
  return add(coord, DIRECTIONS[direction]);
}

// Get all 6 direction vectors
export function getDirections() {
  return DIRECTIONS;
}

// Coordinate equality
export function equals(a, b) {
  return a.x === b.x && a.y === b.y && a.z === b.z;
}

// Convert coordinate to string key for Map storage
export function hash(coord) {
  return `${coord.x},${coord.y},${coord.z}`;
}

// Convert string key back to coordinate
export function unhash(key) {
  const [x, y, z] = key.split(",").map(Number);
  return { x, y, z };
}

// Calculate distance between two coordinates (Manhattan distance in cube space)
export function distance(a, b) {
  return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2;
}

// Linear interpolation between two coordinates
export function lerp(a, b, t) {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  };
}

// Round floating point cube coordinate to nearest hex
export function round(coord) {
  let rx = Math.round(coord.x);
  let ry = Math.round(coord.y);
  let rz = Math.round(coord.z);

  const xDiff = Math.abs(rx - coord.x);
  const yDiff = Math.abs(ry - coord.y);
  const zDiff = Math.abs(rz - coord.z);

  if (xDiff > yDiff && xDiff > zDiff) {
    rx = -ry - rz;
  } else if (yDiff > zDiff) {
    ry = -rx - rz;
  } else {
    rz = -rx - ry;
  }

  return { x: rx, y: ry, z: rz };
}

// Coordinate conversion: Cube to Pixel
export function cubeToPixel(coord, layout, hexSize) {
  const x = coord.x;
  const z = coord.z;

  if (layout === "pointy") {
    return {
      x: hexSize * (Math.sqrt(3) * x + (Math.sqrt(3) / 2) * z),
      y: hexSize * ((3 / 2) * z),
    };
  } else {
    // flat layout
    return {
      x: hexSize * ((3 / 2) * x),
      y: hexSize * ((Math.sqrt(3) / 2) * x + Math.sqrt(3) * z),
    };
  }
}

// Coordinate conversion: Pixel to Cube
export function pixelToCube(pixel, layout, hexSize) {
  if (layout === "pointy") {
    const q = ((Math.sqrt(3) / 3) * pixel.x - (1 / 3) * pixel.y) / hexSize;
    const r = ((2 / 3) * pixel.y) / hexSize;
    return round({ x: q, y: -q - r, z: r });
  } else {
    // flat layout
    const q = ((2 / 3) * pixel.x) / hexSize;
    const r = ((-1 / 3) * pixel.x + (Math.sqrt(3) / 3) * pixel.y) / hexSize;
    return round({ x: q, y: -q - r, z: r });
  }
}

// Coordinate conversion: Cube to Offset
export function cubeToOffset(coord, layout) {
  if (layout === "pointy") {
    // odd-r offset
    const col = coord.x + (coord.z - (coord.z & 1)) / 2;
    const row = coord.z;
    return { col, row };
  } else {
    // odd-q offset
    const col = coord.x;
    const row = coord.z + (coord.x - (coord.x & 1)) / 2;
    return { col, row };
  }
}

// Coordinate conversion: Offset to Cube
export function offsetToCube(offset, layout) {
  if (layout === "pointy") {
    // odd-r offset
    const x = offset.col - (offset.row - (offset.row & 1)) / 2;
    const z = offset.row;
    const y = -x - z;
    return { x, y, z };
  } else {
    // odd-q offset
    const x = offset.col;
    const z = offset.row - (offset.col - (offset.col & 1)) / 2;
    const y = -x - z;
    return { x, y, z };
  }
}

// export const coord = (col, row,) => offsetToCube({ col, row }, layout);
