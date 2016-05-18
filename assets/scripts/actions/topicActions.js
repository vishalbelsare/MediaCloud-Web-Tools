import * as api from '../lib/topics';

export const FETCH_TOPIC_LIST = 'FETCH_TOPIC_LIST';
export const SELECT_TOPIC = 'SELECT_TOPIC';
export const TOPIC_FILTER_BY_SNAPSHOT = 'TOPIC_FILTER_BY_SNAPSHOT';
export const TOPIC_FILTER_BY_TIMESPAN = 'TOPIC_FILTER_BY_TIMESPAN';
export const FETCH_TOPIC_SUMMARY = 'FETCH_TOPIC_SUMMARY';
export const FETCH_TOPIC_TOP_STORIES = 'FETCH_TOPIC_TOP_STORIES';
export const SORT_TOPIC_TOP_STORIES = 'SORT_TOPIC_TOP_STORIES';
export const FETCH_TOPIC_TOP_MEDIA = 'FETCH_TOPIC_TOP_MEDIA';
export const SORT_TOPIC_TOP_MEDIA = 'SORT_TOPIC_TOP_MEDIA';
export const FETCH_TOPIC_TOP_WORDS = 'FETCH_TOPIC_TOP_WORDS';
export const FETCH_TOPIC_SNAPSHOTS_LIST = 'FETCH_TOPIC_SNAPSHOTS_LIST';
export const FETCH_TOPIC_TIMESPANS_LIST = 'FETCH_TOPIC_TIMESPANS_LIST';

export function fetchTopicsList() {
  return {
    type: FETCH_TOPIC_LIST,
    payload: {
      promise: api.topicsList(),
    },
  };
}

export function selectTopic(id) {
  return {
    type: SELECT_TOPIC,
    payload: { id },
  };
}

export function filterBySnapshot(id) {
  return {
    type: TOPIC_FILTER_BY_SNAPSHOT,
    payload: { id },
  };
}

export function filterByTimespan(id) {
  return {
    type: TOPIC_FILTER_BY_TIMESPAN,
    payload: { id },
  };
}

export function fetchTopicSummary(id) {
  return {
    type: FETCH_TOPIC_SUMMARY,
    payload: {
      promise: api.topicSummary(id),
    },
  };
}

export function fetchTopicTopStories(topicId, snapshotId, sort) {
  return {
    type: FETCH_TOPIC_TOP_STORIES,
    payload: {
      promise: api.topicTopStories(topicId, snapshotId, sort),
    },
  };
}

export function sortTopicTopStories(sort) {
  return {
    type: SORT_TOPIC_TOP_STORIES,
    payload: { sort },
  };
}

export function fetchTopicTopMedia(topicId, snapshotId, sort) {
  return {
    type: FETCH_TOPIC_TOP_MEDIA,
    payload: {
      promise: api.topicTopMedia(topicId, snapshotId, sort),
    },
  };
}

export function sortTopicTopMedia(sort) {
  return {
    type: SORT_TOPIC_TOP_MEDIA,
    payload: { sort },
  };
}

export function fetchTopicTopWords(topicId, snapshotId, sort) {
  return {
    type: FETCH_TOPIC_TOP_WORDS,
    payload: {
      promise: api.topicTopWords(topicId, snapshotId, sort),
    },
  };
}

export function fetchTopicSnapshotsList(id) {
  return {
    type: FETCH_TOPIC_SNAPSHOTS_LIST,
    payload: {
      promise: api.topicSnapshotsList(id),
    },
  };
}


export function fetchTopicSnapshotTimeslicesList(topicId, snapshotId) {
  return {
    type: FETCH_TOPIC_TIMESPANS_LIST,
    payload: {
      promise: api.topicSnapshotTimespansList(topicId, snapshotId),
    },
  };
}
