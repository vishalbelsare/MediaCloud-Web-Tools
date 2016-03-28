import { promiseToFetchControversyList, promiseToFetchControversySummary } from '../lib/controversy';

export const FETCH_CONTROVERSY_LIST = 'FETCH_CONTROVERSY_LIST';
export const FETCH_CONTROVERSY_SUMMARY = 'FETCH_CONTROVERSY_SUMMARY';

export function fetchControversyList() {
  return {
    type: FETCH_CONTROVERSY_LIST,
    payload: {
      promise: promiseToFetchControversyList()
    }
  };
}

export function fetchControversySummary(id) {
  return {
    type: FETCH_CONTROVERSY_SUMMARY,
    payload: {
      promise: promiseToFetchControversySummary(id)
    }
  };
}
