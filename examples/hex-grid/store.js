/**
 * Minimal Redux-like store for state management
 */

export function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = [];

  return {
    getState: () => state,

    dispatch: (action) => {
      state = reducer(state, action);
      listeners.forEach((fn) => fn(state));
    },

    subscribe: (fn) => {
      listeners.push(fn);
      return () => listeners.splice(listeners.indexOf(fn), 1);
    },
  };
}
