/**
 * Entity system for hex grid
 * Creates entities with unique IDs and component data
 */

let nextId = 0;

/**
 * Create an entity with the given components
 * @param {Object} components - Component data for the entity
 * @returns {Object} Entity object with id and components
 *
 * @example
 * const player = entities.create({
 *   player: true,
 *   health: 100,
 *   attack: 15,
 * });
 * // Returns: { id: "entity-0", player: true, health: 100, attack: 15 }
 */
export function create(components = {}) {
  const id = `entity-${nextId++}`;
  return {
    id,
    ...components,
  };
}

/**
 * Reset the entity ID counter (useful for testing)
 */
export function resetIds() {
  nextId = 0;
}

/**
 * Create an entities manager object
 * @returns {Object} Entities manager with create method
 */
export function createEntities() {
  let localNextId = 0;

  return {
    create(components = {}) {
      const id = `entity-${localNextId++}`;
      return {
        id,
        ...components,
      };
    },
    resetIds() {
      localNextId = 0;
    },
  };
}

// Default entities instance
export const entities = createEntities();
