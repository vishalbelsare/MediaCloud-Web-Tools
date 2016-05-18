import * as api from '../lib/topics';

export const FETCH_CONTROVERSY_LIST = 'FETCH_CONTROVERSY_LIST';
export const SELECT_CONTROVERSY = 'SELECT_CONTROVERSY';
export const CONTROVERSY_FILTER_BY_SNAPSHOT = 'CONTROVERSY_FILTER_BY_SNAPSHOT';
export const FETCH_CONTROVERSY_SUMMARY = 'FETCH_CONTROVERSY_SUMMARY';
export const FETCH_CONTROVERSY_TOP_STORIES = 'FETCH_CONTROVERSY_TOP_STORIES';
export const FETCH_CONTROVERSY_TOP_MEDIA = 'FETCH_CONTROVERSY_TOP_MEDIA';
export const FETCH_CONTROVERSY_TOP_WORDS = 'FETCH_CONTROVERSY_TOP_WORDS';
export const FETCH_CONTROVERSY_SNAPSHOTS_LIST = 'FETCH_CONTROVERSY_SNAPSHOTS_LIST';

export function fetchControversiesList() {
  return {
    type: FETCH_CONTROVERSY_LIST,
    payload: {
      promise: api.controversiesList(),
    },
  };
}

export function selectControversy(id) {
  return {
    type: SELECT_CONTROVERSY,
    payload: { id },
  };
}

export function filterBySnapshot(id) {
  return {
    type: CONTROVERSY_FILTER_BY_SNAPSHOT,
    payload: { id },
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

export function fetchControversyTopStories(topicId, snapshotId, sort) {
  return {
    type: FETCH_CONTROVERSY_TOP_STORIES,
    payload: {
      promise: api.controversyTopStories(topicId, snapshotId, sort),
    },
  };
}

export function fetchControversyTopMedia(topicId, snapshotId, sort) {
  return {
    type: FETCH_CONTROVERSY_TOP_MEDIA,
    payload: {
      promise: api.controversyTopMedia(topicId, snapshotId, sort),
    },
  };
}

export function fetchControversyTopWords(topicId, snapshotId, sort) {
  return {
    type: FETCH_CONTROVERSY_TOP_WORDS,
    payload: {
      promise: api.controversyTopWords(topicId, snapshotId, sort),
    },
  };
}

export function fetchControversySnapshotsList(id) {
  return {
    type: FETCH_CONTROVERSY_SNAPSHOTS_LIST,
    payload: {
      promise: api.topicSnapshotsList(id),
    },
  };
}
