/**
 * Game reducer - centralized state transitions
 */

import Hexes from "../../src/index.js";
import { movementSystem } from "./systems/movementSystem.js";
import { combatSystem } from "./systems/combatSystem.js";

export function gameReducer(state, action) {
  switch (action.type) {
    case "SELECT_CELL":
      return { ...state, selectedCell: action.coord };

    case "TICK": {
      let newState = movementSystem(state);
      newState = combatSystem(newState);
      return { ...newState, selectedCell: null };
    }

    case "UPDATE_ENTITY": {
      const { coord, entityId, updates } = action;
      const cell = Hexes.getCell(state.grid, coord);
      const entity = cell?.data?.[entityId];
      if (!entity) return state;
      return {
        ...state,
        grid: Hexes.setCellData(state.grid, coord, { ...entity, ...updates }),
      };
    }

    default:
      return state;
  }
}
