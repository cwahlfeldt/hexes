/**
 * ECS-style query system for hex grid entities
 * Entities are stored in cell.data by their ID and have components (properties)
 * Query by component names to find cells with matching entities
 */

/**
 * Query cells that have entities with the specified components
 * @param {Object} grid - The hex grid
 * @param {...string} components - Component names to query for
 * @returns {Array} Array of [cell, entity] tuples for each matching entity
 *
 * @example
 * // Find all cells with entities that have health and attack components
 * const units = query(grid, "health", "attack");
 * // Returns: [[cell, entity], [cell, entity], ...]
 *
 * // Find all cells with entities that have a "player" component
 * const [[cell, player]] = query(grid, "player");
 */
export function query(grid, ...components) {
  const results = [];

  for (const [key, cell] of grid.cells) {
    const data = cell.data;
    if (!data || typeof data !== "object") continue;

    // Iterate through all entities stored in cell.data
    for (const entityKey of Object.keys(data)) {
      const entity = data[entityKey];
      // Check if this is an entity object with the required components
      if (entity && typeof entity === "object" && hasComponents(entity, components)) {
        results.push([cell, entity]);
      }
    }
  }

  return results;
}

/**
 * Check if an entity has all specified components
 * @param {Object} entity - The entity to check
 * @param {Array<string>} components - Component names to check for
 * @returns {boolean} True if entity has all components
 */
export function hasComponents(entity, components) {
  return components.every((comp) => comp in entity);
}
