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
 * const player = createEntity({
 *   player: true,
 *   health: 100,
 *   attack: 15,
 * });
 * // Returns: { id: "entity-0", player: true, health: 100, attack: 15 }
 */
export function createEntity(components = {}) {
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
