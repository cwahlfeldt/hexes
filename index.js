import {
  createGrid,
  createHexGrid,
  createCustomGrid,
  setPassable,
  isPassable,
  getObstacles,
  findPath,
  getRange,
  hasLineOfSight,
  getLine,
  cubeToPixel,
  pixelToCube,
  getReachable,
  distance,
} from "./src/index.js";

// Constants
const HEX_SIZE = 30;

// State
let layout = "flat"; // Configurable layout: 'pointy' or 'flat'
let gridSize = 5; // Configurable grid size
let grid = null;
let mode = "obstacle";
let currentShape = "hexagon";
let startPoint = null;
let endPoint = null;
let hoveredCell = null;
let gridBounds = null;

// Grid shape creation functions
function createRectangleGrid() {
  const width = Math.floor(gridSize * 1.5);
  const height = gridSize;
  return createGrid(width, height, { layout });
}

function createHexagonGrid() {
  return createHexGrid(gridSize, { layout });
}

function createTriangleGrid() {
  const size = gridSize;
  return createCustomGrid(
    (coord) => coord.x >= 0 && coord.y <= 0 && coord.z >= 0,
    { minX: 0, maxX: size, minY: -size, maxY: 0 },
    { layout }
  );
}

function createDiamondGrid() {
  return createCustomGrid(
    (coord) => {
      // Diamond/Rhombus shape: rotated square
      return (
        coord.x >= -gridSize &&
        coord.x <= gridSize &&
        coord.y >= -gridSize &&
        coord.y <= gridSize
      );
    },
    { minX: -gridSize, maxX: gridSize, minY: -gridSize, maxY: gridSize },
    { layout }
  );
}

function createTrapezoidGrid() {
  return createCustomGrid(
    (coord) => {
      // Trapezoid: gets narrower at the top
      const minRow = -gridSize;
      const maxRow = gridSize;
      const row = coord.z;

      if (row < minRow || row > maxRow) return false;

      // Width decreases as we go up (negative row)
      const rowFromBottom = row - minRow;
      const widthAtRow =
        Math.floor(gridSize * 1.5) - Math.floor(rowFromBottom * 0.5);
      const offset = Math.floor(rowFromBottom * 0.25);

      return coord.x >= offset && coord.x < offset + widthAtRow;
    },
    { minX: -2, maxX: gridSize * 2, minY: -gridSize * 2, maxY: gridSize },
    { layout }
  );
}

function createParallelogramGrid() {
  const width = Math.floor(gridSize * 1.2);
  const height = gridSize;
  return createCustomGrid(
    (coord) =>
      coord.x >= 0 && coord.x < width && coord.z >= 0 && coord.z < height,
    { minX: 0, maxX: width, minY: -height * 2, maxY: 0 },
    { layout }
  );
}

const shapeCreators = {
  rectangle: createRectangleGrid,
  hexagon: createHexagonGrid,
  triangle: createTriangleGrid,
  diamond: createDiamondGrid,
  trapezoid: createTrapezoidGrid,
  parallelogram: createParallelogramGrid,
};

function changeGridShape(shape) {
  currentShape = shape;
  grid = shapeCreators[shape]();
  startPoint = null;
  endPoint = null;
  gridBounds = null;
  draw();
}

// Calculate grid bounds
function calculateGridBounds() {
  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;

  grid.cells.forEach((cell) => {
    const pixel = cubeToPixel(cell.coord, layout, HEX_SIZE);
    minX = Math.min(minX, pixel.x);
    maxX = Math.max(maxX, pixel.x);
    minY = Math.min(minY, pixel.y);
    maxY = Math.max(maxY, pixel.y);
  });

  return { minX, maxX, minY, maxY };
}

// Canvas setup
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth - 320;
  canvas.height = window.innerHeight;
  gridBounds = null; // Recalculate bounds on resize
  if (grid) {
    draw();
  }
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Drawing functions
function drawHex(center, size, color, strokeColor = null, strokeWidth = 1) {
  ctx.beginPath();

  // Pointy-top hexagons have a vertex at the top
  // Flat-top hexagons have a flat edge at the top (rotated 30 degrees)
  const angleOffset = layout === "pointy" ? -Math.PI / 6 : 0;

  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + angleOffset;
    const x = center.x + size * Math.cos(angle);
    const y = center.y + size * Math.sin(angle);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
}

function getCellColor(coord) {
  // Check if it's the start or end point
  if (
    startPoint &&
    coord.x === startPoint.x &&
    coord.y === startPoint.y &&
    coord.z === startPoint.z
  ) {
    return "#f093fb";
  }
  if (
    endPoint &&
    coord.x === endPoint.x &&
    coord.y === endPoint.y &&
    coord.z === endPoint.z
  ) {
    return "#feca57";
  }

  // Check if it's an obstacle
  if (!isPassable(grid, coord)) {
    return "#ea5455";
  }

  // Check if it's hovered
  if (
    hoveredCell &&
    coord.x === hoveredCell.x &&
    coord.y === hoveredCell.y &&
    coord.z === hoveredCell.z
  ) {
    return "#667eea";
  }

  return "#2d4059";
}

function gridToScreen(coord) {
  if (!gridBounds) {
    gridBounds = calculateGridBounds();
  }

  const pixel = cubeToPixel(coord, layout, HEX_SIZE);
  const gridCenterX = (gridBounds.minX + gridBounds.maxX) / 2;
  const gridCenterY = (gridBounds.minY + gridBounds.maxY) / 2;

  return {
    x: pixel.x - gridCenterX + canvas.width / 2,
    y: pixel.y - gridCenterY + canvas.height / 2,
  };
}

function screenToGrid(screenX, screenY) {
  if (!gridBounds) {
    gridBounds = calculateGridBounds();
  }

  const gridCenterX = (gridBounds.minX + gridBounds.maxX) / 2;
  const gridCenterY = (gridBounds.minY + gridBounds.maxY) / 2;

  const pixel = {
    x: screenX - canvas.width / 2 + gridCenterX,
    y: screenY - canvas.height / 2 + gridCenterY,
  };
  return pixelToCube(pixel, layout, HEX_SIZE);
}

function draw() {
  // Clear canvas
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Calculate what to highlight based on mode
  let path = null;
  let rangeSet = new Set();
  let losLine = [];

  if (mode === "path" && startPoint && endPoint) {
    path = findPath(grid, startPoint, endPoint);
  } else if (mode === "range" && startPoint) {
    const range = getReachable(grid, startPoint, 5);
    range.forEach((coord) => rangeSet.add(`${coord.x},${coord.y},${coord.z}`));
  } else if (mode === "los" && startPoint && endPoint) {
    losLine = getLine(startPoint, endPoint);
  }

  // Draw all cells
  grid.cells.forEach((cell) => {
    const center = gridToScreen(cell.coord);
    const key = `${cell.coord.x},${cell.coord.y},${cell.coord.z}`;

    let color = getCellColor(cell.coord);
    let strokeColor = "rgba(255, 255, 255, 0.1)";
    let strokeWidth = 1;

    // Highlight path
    if (path) {
      const inPath = path.some(
        (p) =>
          p.x === cell.coord.x && p.y === cell.coord.y && p.z === cell.coord.z
      );
      if (inPath && !!isPassable(grid, cell.coord)) {
        color = "#4facfe";
        strokeColor = "#00f2fe";
        strokeWidth = 2;
      }
    }

    // Highlight range
    if (rangeSet.has(key)) {
      if (color === "#2d4059") {
        color = "rgba(102, 126, 234, 0.3)";
      }
      strokeColor = "#667eea";
      strokeWidth = 2;
    }

    // Highlight line of sight
    if (losLine.length > 0) {
      const inLine = losLine.some(
        (p) =>
          p.x === cell.coord.x && p.y === cell.coord.y && p.z === cell.coord.z
      );
      if (inLine) {
        const hasLOS = hasLineOfSight(grid, startPoint, endPoint);
        color = hasLOS ? "rgba(79, 172, 254, 0.5)" : "rgba(245, 87, 108, 0.5)";
        strokeColor = hasLOS ? "#4facfe" : "#f5576c";
        strokeWidth = 2;
      }
    }

    drawHex(center, HEX_SIZE - 2, color, strokeColor, strokeWidth);
  });

  // Draw path if it doesn't exist
  if (mode === "path" && startPoint && endPoint && !path) {
    // Show "no path" indicator
    const startScreen = gridToScreen(startPoint);
    const endScreen = gridToScreen(endPoint);

    ctx.strokeStyle = "#ea5455";
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(startScreen.x, startScreen.y);
    ctx.lineTo(endScreen.x, endScreen.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Update UI
  updateUI();
}

function updateUI() {
  const obstacles = getObstacles(grid);
  document.getElementById("obstacle-count").textContent = obstacles.length;
  document.getElementById("total-cells").textContent = grid.cells.size;

  if (mode === "path" && startPoint && endPoint) {
    const path = findPath(grid, startPoint, endPoint);
    document.getElementById("path-info").style.display = "flex";
    document.getElementById("path-length").textContent = path
      ? path.length
      : "No path";
  } else {
    document.getElementById("path-info").style.display = "none";
  }
}

// Event handlers
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const coord = screenToGrid(x, y);
  const cell = grid.cells.get(`${coord.x},${coord.y},${coord.z}`);

  if (!cell) return;

  if (mode === "obstacle") {
    grid = setPassable(grid, coord, !isPassable(grid, coord));
  } else if (mode === "path" || mode === "range" || mode === "los") {
    if (!startPoint || (startPoint && endPoint)) {
      startPoint = coord;
      endPoint = null;
    } else if (!endPoint) {
      endPoint = coord;
    }
  }

  draw();
});

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const coord = screenToGrid(x, y);
  const cell = grid.cells.get(`${coord.x},${coord.y},${coord.z}`);

  if (cell) {
    hoveredCell = coord;
  } else {
    hoveredCell = null;
  }

  draw();
});

canvas.addEventListener("mouseleave", () => {
  hoveredCell = null;
  draw();
});

// Grid size slider
const sizeSlider = document.getElementById("grid-size-slider");
const sizeValue = document.getElementById("size-value");

sizeSlider.addEventListener("input", (e) => {
  gridSize = parseInt(e.target.value);
  sizeValue.textContent = gridSize;
  changeGridShape(currentShape);
});

// Layout buttons
const layoutButtons = {
  "layout-pointy": "pointy",
  "layout-flat": "flat",
};

Object.keys(layoutButtons).forEach((id) => {
  document.getElementById(id).addEventListener("click", () => {
    layout = layoutButtons[id];
    changeGridShape(currentShape);

    // Update button states
    Object.keys(layoutButtons).forEach((btnId) => {
      document.getElementById(btnId).classList.remove("active");
    });
    document.getElementById(id).classList.add("active");
  });
});

// Shape buttons
const shapeButtons = {
  "shape-rectangle": "rectangle",
  "shape-hexagon": "hexagon",
  "shape-triangle": "triangle",
  "shape-diamond": "diamond",
  "shape-trapezoid": "trapezoid",
  "shape-parallelogram": "parallelogram",
};

Object.keys(shapeButtons).forEach((id) => {
  document.getElementById(id).addEventListener("click", () => {
    const shape = shapeButtons[id];
    changeGridShape(shape);

    // Update button states
    Object.keys(shapeButtons).forEach((btnId) => {
      document.getElementById(btnId).classList.remove("active");
    });
    document.getElementById(id).classList.add("active");
  });
});

// Mode buttons
const modeButtons = {
  "mode-obstacle": "obstacle",
  "mode-path": "path",
  "mode-range": "range",
  "mode-los": "los",
};

const instructions = {
  obstacle:
    "<strong>Click</strong> on hexes to toggle obstacles. Walls block pathfinding.",
  path: "<strong>Click</strong> to set start point, <strong>click again</strong> to set end point. A* pathfinding will find the shortest path.",
  range:
    "<strong>Click</strong> to set a center point. Shows all cells reachable within 5 steps (considering obstacles).",
  los: "<strong>Click</strong> to set start and end points. Green line = clear line of sight. Red = blocked.",
};

Object.keys(modeButtons).forEach((id) => {
  document.getElementById(id).addEventListener("click", () => {
    mode = modeButtons[id];
    startPoint = null;
    endPoint = null;

    // Update button states
    Object.keys(modeButtons).forEach((btnId) => {
      document.getElementById(btnId).classList.remove("active");
    });
    document.getElementById(id).classList.add("active");

    // Update instructions
    document.getElementById("instructions").innerHTML = instructions[mode];

    draw();
  });
});

// Action buttons
document.getElementById("clear-obstacles").addEventListener("click", () => {
  grid.cells.forEach((cell) => {
    grid = setPassable(grid, cell.coord, true);
  });
  draw();
});

document.getElementById("random-obstacles").addEventListener("click", () => {
  grid.cells.forEach((cell) => {
    const shouldBeObstacle = Math.random() < 0.2;
    grid = setPassable(grid, cell.coord, !shouldBeObstacle);
  });
  draw();
});

document.getElementById("clear-all").addEventListener("click", () => {
  changeGridShape(currentShape);
});

// Initialize grid and draw
grid = createRectangleGrid();
draw();
