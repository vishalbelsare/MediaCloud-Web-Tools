import { promiseToListControversies } from '../lib/controversy';

export const LIST_CONTROVERSIES = 'LIST_CONTROVERSIES';

export function listControversies() {
  return {
    type: LIST_CONTROVERSIES,
    payload: {
      promise: promiseToListControversies()
    }
  };
}
