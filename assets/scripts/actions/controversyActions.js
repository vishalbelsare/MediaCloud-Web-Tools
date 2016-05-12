import * as api from '../lib/controversy';

export const FETCH_CONTROVERSY_LIST = 'FETCH_CONTROVERSY_LIST';
export const FETCH_CONTROVERSY_SUMMARY = 'FETCH_CONTROVERSY_SUMMARY';
export const FETCH_CONTROVERSY_TOP_STORIES = 'FETCH_CONTROVERSY_TOP_STORIES';
export const FETCH_CONTROVERSY_TOP_MEDIA = 'FETCH_CONTROVERSY_TOP_MEDIA';

export function fetchControversiesList() {
  return {
    type: FETCH_CONTROVERSY_LIST,
    payload: {
      promise: api.controversiesList(),
    },
  };
}

export function fetchControversySummary(id) {
  return {
    type: FETCH_CONTROVERSY_SUMMARY,
    payload: {
      promise: api.controversySummary(id),
    },
  };
}

export function fetchControversyTopStories(id, sort) {
  return {
    type: FETCH_CONTROVERSY_TOP_STORIES,
    payload: {
      promise: api.controversyTopStories(id, sort),
    },
  };
}

export function fetchControversyTopMedia(id, sort) {
  return {
    type: FETCH_CONTROVERSY_TOP_MEDIA,
    payload: {
      promise: api.controversyTopMedia(id, sort),
    },
  };
}
