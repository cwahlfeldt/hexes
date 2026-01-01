/**
 * Rendering logic for hex grid
 * Handles all canvas drawing operations
 */
import Hexes from "../../src/index.js";

/**
 * Create a renderer for the hex grid
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {Object} options - Renderer options
 * @returns {Object} Renderer object with methods
 */
export function createRenderer(canvas, options = {}) {
  const ctx = canvas.getContext("2d");
  const hexSize = options.hexSize || 30;
  const layout = options.layout || "pointy";

  // Center offset for the canvas
  const offsetX = canvas.width / 2;
  const offsetY = canvas.height / 2;

  /**
   * Draw a hexagon at a given pixel position
   * @param {number} x - Center x position
   * @param {number} y - Center y position
   * @param {string} fillColor - Fill color
   * @param {string} strokeColor - Stroke color
   */
  function drawHexagon(x, y, fillColor = "#f0f0f0", strokeColor = "#333") {
    ctx.beginPath();

    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + (layout === "pointy" ? Math.PI / 6 : 0);
      const hx = x + hexSize * Math.cos(angle);
      const hy = y + hexSize * Math.sin(angle);

      if (i === 0) {
        ctx.moveTo(hx, hy);
      } else {
        ctx.lineTo(hx, hy);
      }
    }

    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  /**
   * Draw an entity (circle) at a given position
   * @param {number} x - Center x position
   * @param {number} y - Center y position
   * @param {string} color - Entity color
   */
  function drawEntity(x, y, color = "#4CAF50") {
    ctx.beginPath();
    ctx.arc(x, y, hexSize * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  /**
   * Clear the canvas
   */
  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * Render the entire grid and entities
   * @param {Object} grid - The hex grid
   */
  function render(grid) {
    clear();

    // Draw all cells
    for (const cell of grid.cells.values()) {
      const pixel = Hexes.cubeToPixel(cell.coord, layout, hexSize);
      const x = pixel.x + offsetX;
      const y = pixel.y + offsetY;

      // Draw hexagon
      drawHexagon(x, y);

      // Draw entities in this cell
      const entities = Object.values(cell.data);
      for (const entity of entities) {
        if (entity.color) {
          drawEntity(x, y, entity.color);
        }
      }
    }
  }

  /**
   * Convert canvas pixel coordinates to hex grid coordinates
   * @param {number} canvasX - Canvas x position
   * @param {number} canvasY - Canvas y position
   * @returns {Object} Cube coordinate
   */
  function pixelToCoord(canvasX, canvasY) {
    const x = canvasX - offsetX;
    const y = canvasY - offsetY;
    return Hexes.pixelToCube({ x, y }, layout, hexSize);
  }

  return {
    render,
    pixelToCoord,
    clear,
    drawHexagon,
    drawEntity,
  };
}
