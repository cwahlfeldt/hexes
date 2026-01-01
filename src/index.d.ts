// Type definitions for Hexes

/** Cube coordinate with x + y + z = 0 constraint */
export interface CubeCoord {
  x: number;
  y: number;
  z: number;
}

/** Offset coordinate for rectangular grids */
export interface OffsetCoord {
  col: number;
  row: number;
}

/** Pixel coordinate */
export interface PixelCoord {
  x: number;
  y: number;
}

/** Hex layout orientation */
export type Layout = "pointy" | "flat";

/** Entity with unique ID and component data */
export interface Entity {
  id: string;
  [component: string]: unknown;
}

/** Cell in the hex grid */
export interface Cell {
  coord: CubeCoord;
  passable: boolean;
  data: Record<string, Entity | unknown>;
}

/** Grid size for hex-shaped grids */
export interface HexSize {
  radius: number;
}

/** Grid size for rectangular grids */
export interface RectangleSize {
  width: number;
  height: number;
}

/** Grid size for custom grids */
export interface CustomSize {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/** Hex grid structure */
export interface Grid {
  cells: Map<string, Cell>;
  layout: Layout;
  size: HexSize | RectangleSize | CustomSize;
}

/** Base options for grid creation */
interface BaseGridOptions {
  layout?: Layout;
  defaultData?: Record<string, unknown>;
}

/** Options for hex-shaped grid */
export interface HexGridOptions extends BaseGridOptions {
  type?: "hex";
  radius: number;
}

/** Options for rectangular grid */
export interface RectangleGridOptions extends BaseGridOptions {
  type: "rectangle";
  width: number;
  height: number;
}

/** Options for custom grid */
export interface CustomGridOptions extends BaseGridOptions {
  type: "custom";
  predicate: (coord: CubeCoord) => boolean;
  bounds: CustomSize;
}

/** All grid creation options */
export type GridOptions = HexGridOptions | RectangleGridOptions | CustomGridOptions;

/** Options for getNeighbors */
export interface NeighborsOptions {
  passableOnly?: boolean;
}

/** Options for findPath */
export interface PathfindingOptions {
  heuristic?: (a: CubeCoord, b: CubeCoord) => number;
  costFn?: (from: CubeCoord, to: CubeCoord) => number;
}

/** Query result tuple */
export type QueryResult = [Cell, Entity];

// Grid creation and management
export function createGrid(options: GridOptions): Grid;
export function getCell(grid: Grid, coord: CubeCoord): Cell | null;
export function setCell(grid: Grid, coord: CubeCoord, cell: Cell): Grid;
export function setCellData(grid: Grid, coord: CubeCoord, ...entities: Entity[]): Grid;
export function removeCellData(grid: Grid, coord: CubeCoord, ...entities: (Entity | string)[]): Grid;
export function updateCell(grid: Grid, coord: CubeCoord, updater: (cell: Cell) => Cell): Grid;
export function removeCell(grid: Grid, coord: CubeCoord): Grid;
export function setPassable(grid: Grid, coord: CubeCoord, passable: boolean): Grid;
export function isPassable(grid: Grid, coord: CubeCoord): boolean;
export function getObstacles(grid: Grid): CubeCoord[];
export function mapCells(grid: Grid, fn: (cell: Cell) => Cell): Grid;
export function filterCells(grid: Grid, predicate: (cell: Cell) => boolean): CubeCoord[];
export function forEachCell(grid: Grid, fn: (cell: Cell) => void): void;
export function hasCell(grid: Grid, coord: CubeCoord): boolean;

// Coordinate utilities
export function add(a: CubeCoord, b: CubeCoord): CubeCoord;
export function subtract(a: CubeCoord, b: CubeCoord): CubeCoord;
export function scale(coord: CubeCoord, factor: number): CubeCoord;
export function neighbor(coord: CubeCoord, direction: number): CubeCoord;
export function getDirections(): CubeCoord[];
export function equals(a: CubeCoord, b: CubeCoord): boolean;
export function hash(coord: CubeCoord): string;
export function unhash(key: string): CubeCoord;
export function distance(a: CubeCoord, b: CubeCoord): number;
export function lerp(a: CubeCoord, b: CubeCoord, t: number): CubeCoord;
export function round(coord: CubeCoord): CubeCoord;
export function cubeToPixel(coord: CubeCoord, layout: Layout, hexSize: number): PixelCoord;
export function pixelToCube(pixel: PixelCoord, layout: Layout, hexSize: number): CubeCoord;
export function cubeToOffset(coord: CubeCoord, layout: Layout): OffsetCoord;
export function offsetToCube(offset: OffsetCoord, layout: Layout): CubeCoord;

// Neighbor and range queries
export function getNeighbors(grid: Grid, coord: CubeCoord, options?: NeighborsOptions): CubeCoord[];
export function getRange(grid: Grid, coord: CubeCoord, range: number): CubeCoord[];
export function getRing(grid: Grid, coord: CubeCoord, radius: number): CubeCoord[];
export function getSpiral(grid: Grid, center: CubeCoord, maxRadius: number): CubeCoord[];
export function getReachable(grid: Grid, start: CubeCoord, maxDistance: number): CubeCoord[];

// Line drawing and line of sight
export function getLine(coordA: CubeCoord, coordB: CubeCoord): CubeCoord[];
export function hasLineOfSight(grid: Grid, coordA: CubeCoord, coordB: CubeCoord): boolean;
export function getVisibleCells(grid: Grid, origin: CubeCoord, maxRange?: number): CubeCoord[];

// Pathfinding
export function findPath(grid: Grid, start: CubeCoord, end: CubeCoord, options?: PathfindingOptions): CubeCoord[] | null;
export function getPathCost(path: CubeCoord[], costFn?: (from: CubeCoord, to: CubeCoord) => number): number;
export function getPathLength(path: CubeCoord[] | null): number;

// Entity queries
export function query(grid: Grid, ...components: string[]): QueryResult[];
export function hasComponents(entity: Entity, components: string[]): boolean;

// Entity system
export function createEntity(components?: Record<string, unknown>): Entity;
export function resetIds(): void;

// Default export namespace
interface HexesNamespace {
  // Grid
  createGrid: typeof createGrid;
  getCell: typeof getCell;
  setCell: typeof setCell;
  setCellData: typeof setCellData;
  removeCellData: typeof removeCellData;
  updateCell: typeof updateCell;
  removeCell: typeof removeCell;
  setPassable: typeof setPassable;
  isPassable: typeof isPassable;
  getObstacles: typeof getObstacles;
  mapCells: typeof mapCells;
  filterCells: typeof filterCells;
  forEachCell: typeof forEachCell;
  hasCell: typeof hasCell;
  // Coordinates
  add: typeof add;
  subtract: typeof subtract;
  scale: typeof scale;
  neighbor: typeof neighbor;
  getDirections: typeof getDirections;
  equals: typeof equals;
  hash: typeof hash;
  unhash: typeof unhash;
  distance: typeof distance;
  lerp: typeof lerp;
  round: typeof round;
  cubeToPixel: typeof cubeToPixel;
  pixelToCube: typeof pixelToCube;
  cubeToOffset: typeof cubeToOffset;
  offsetToCube: typeof offsetToCube;
  // Neighbors
  getNeighbors: typeof getNeighbors;
  getRange: typeof getRange;
  getRing: typeof getRing;
  getSpiral: typeof getSpiral;
  getReachable: typeof getReachable;
  // Line of sight
  getLine: typeof getLine;
  hasLineOfSight: typeof hasLineOfSight;
  getVisibleCells: typeof getVisibleCells;
  // Pathfinding
  findPath: typeof findPath;
  getPathCost: typeof getPathCost;
  getPathLength: typeof getPathLength;
  // Query
  query: typeof query;
  hasComponents: typeof hasComponents;
  // Entities
  createEntity: typeof createEntity;
  resetIds: typeof resetIds;
}

declare const Hexes: HexesNamespace;
export default Hexes;
