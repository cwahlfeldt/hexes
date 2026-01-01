/**
 * ECS-style query system for hex grid entities
 * Allows querying entities by type, id, components, or custom predicates
 */

/**
 * Get all entities from the grid
 * @param {Object} grid - The hex grid
 * @returns {Array} Array of all entities with their current state
 */
export function getAllEntities(grid) {
  const entities = [];

  for (const coordKey in grid) {
    const cell = grid[coordKey];
    for (const entityId in cell) {
      entities.push(cell[entityId]);
    }
  }

  return entities;
}

/**
 * Find an entity by its ID
 * @param {Object} grid - The hex grid
 * @param {string} entityId - The entity ID to search for
 * @returns {Object|null} The entity if found, null otherwise
 */
export function getEntityById(grid, entityId) {
  for (const coordKey in grid) {
    const cell = grid[coordKey];
    if (cell[entityId]) {
      return cell[entityId];
    }
  }
  return null;
}

/**
 * Find the first entity matching a type
 * @param {Object} grid - The hex grid
 * @param {string} type - The entity type (e.g., "player", "enemy", "item")
 * @returns {Object|null} The first matching entity if found, null otherwise
 */
export function getEntityByType(grid, type) {
  for (const coordKey in grid) {
    const cell = grid[coordKey];
    for (const entityId in cell) {
      if (cell[entityId].type === type) {
        return cell[entityId];
      }
    }
  }
  return null;
}

/**
 * Find all entities matching a type
 * @param {Object} grid - The hex grid
 * @param {string} type - The entity type (e.g., "player", "enemy", "item")
 * @returns {Array} Array of all matching entities
 */
export function getEntitiesByType(grid, type) {
  const entities = [];

  for (const coordKey in grid) {
    const cell = grid[coordKey];
    for (const entityId in cell) {
      if (cell[entityId].type === type) {
        entities.push(cell[entityId]);
      }
    }
  }

  return entities;
}

/**
 * Query entities with a custom predicate function
 * @param {Object} grid - The hex grid
 * @param {Function} predicate - Function that returns true for matching entities
 * @returns {Array} Array of all matching entities
 */
export function queryEntities(grid, predicate) {
  const entities = [];

  for (const coordKey in grid) {
    const cell = grid[coordKey];
    for (const entityId in cell) {
      const entity = cell[entityId];
      if (predicate(entity)) {
        entities.push(entity);
      }
    }
  }

  return entities;
}

/**
 * Query entities by component (entities that have a specific property)
 * @param {Object} grid - The hex grid
 * @param {string} componentName - The component/property name to check for
 * @returns {Array} Array of entities that have the component
 */
export function getEntitiesWithComponent(grid, componentName) {
  return queryEntities(grid, entity => componentName in entity);
}

/**
 * Query entities by multiple components
 * @param {Object} grid - The hex grid
 * @param {Array<string>} componentNames - Array of component names
 * @returns {Array} Array of entities that have all the specified components
 */
export function getEntitiesWithComponents(grid, componentNames) {
  return queryEntities(grid, entity =>
    componentNames.every(comp => comp in entity)
  );
}

/**
 * Move an entity and return the updated entity reference
 * @param {Object} grid - The hex grid
 * @param {Object} entity - The entity to move
 * @param {Object} destination - The destination coordinate {x, y, z}
 * @param {Function} setCellData - Function to set cell data
 * @returns {Object} Object containing the new grid and updated entity
 */
export function moveEntity(grid, entity, destination, setCellData) {
  const unitCoord = entity.coord;
  const removedUnitGrid = setCellData(grid, unitCoord, {});

  const updatedEntity = {
    ...entity,
    coord: destination,
  };

  const newGrid = setCellData(removedUnitGrid, destination, {
    [entity.id]: updatedEntity,
  });

  return {
    grid: newGrid,
    entity: updatedEntity
  };
}

/**
 * Update an entity's properties
 * @param {Object} grid - The hex grid
 * @param {string} entityId - The entity ID
 * @param {Object} updates - Properties to update
 * @param {Function} setCellData - Function to set cell data
 * @returns {Object} Object containing the new grid and updated entity
 */
export function updateEntity(grid, entityId, updates, setCellData) {
  const entity = getEntityById(grid, entityId);
  if (!entity) {
    return { grid, entity: null };
  }

  const updatedEntity = {
    ...entity,
    ...updates,
    coord: entity.coord, // Preserve coordinate
  };

  const newGrid = setCellData(grid, entity.coord, {
    [entity.id]: updatedEntity,
  });

  return {
    grid: newGrid,
    entity: updatedEntity
  };
}
