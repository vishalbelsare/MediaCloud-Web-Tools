import { controversiesList, controversySummary, controversyTopStories } from '../lib/controversy';

export const FETCH_CONTROVERSY_LIST = 'FETCH_CONTROVERSY_LIST';
export const FETCH_CONTROVERSY_SUMMARY = 'FETCH_CONTROVERSY_SUMMARY';
export const FETCH_CONTROVERSY_TOP_STORIES = 'FETCH_CONTROVERSY_TOP_STORIES';

export function fetchControversiesList() {
  return {
    type: FETCH_CONTROVERSY_LIST,
    payload: {
      promise: controversiesList(),
    },
  };
}

export function fetchControversySummary(id) {
  return {
    type: FETCH_CONTROVERSY_SUMMARY,
    payload: {
      promise: controversySummary(id),
    },
  };
}

export function fetchControversyTopStories(id, sort) {
  return {
    type: FETCH_CONTROVERSY_TOP_STORIES,
    payload: {
      promise: controversyTopStories(id, sort),
    },
  };
}
