import * as api from '../lib/sources';

// export const FETCH_SOURCE_LIST = 'FETCH_SOURCE_LIST';
export const FETCH_SOURCE_COLLECTION_LIST = 'FETCH_SOURCE_COLLECTION_LIST';
export const FETCH_SOURCE_DETAILS = 'FETCH_SOURCE_DETAILS';
export const FETCH_SOURCE_COLLECTION_DETAILS = 'FETCH_SOURCE_COLLECTION_DETAILS';

export const SELECT_SOURCE = 'SELECT_SOURCE';
export const SOURCE_FILTER_BY_SNAPSHOT = 'SOURCE_FILTER_BY_SNAPSHOT';
export const SOURCE_FILTER_BY_TIMESPAN = 'SOURCE_FILTER_BY_TIMESPAN';
export const FETCH_SOURCE_SUMMARY = 'FETCH_SOURCE_SUMMARY';
// export const FETCH_SOURCE_TOP_STORIES = 'FETCH_SOURCE_TOP_STORIES';
// // export const SORT_SOURCE_TOP_STORIES = 'SORT_SOURCE_TOP_STORIES';
// export const FETCH_SOURCE_TOP_MEDIA = 'FETCH_SOURCE_TOP_MEDIA';
export const SORT_SOURCE_DETAILS = 'SORT_SOURCE_DETAILS';
export const SORT_SOURCE_COLLECTION_DETAILS = 'SORT_SOURCE_COLLECTION_DETAILS';
export const FETCH_SOURCE_TOP_WORDS = 'FETCH_SOURCE_TOP_WORDS';
export const FETCH_SOURCE_SNAPSHOTS_LIST = 'FETCH_SOURCE_SNAPSHOTS_LIST';
export const FETCH_SOURCE_TIMESPANS_LIST = 'FETCH_SOURCE_TIMESPANS_LIST';
export const FETCH_SOURCE_SENTENCE_COUNT = 'FETCH_SOURCE_SENTENCE_COUNT';

export function selectSource(id) {
  return {
    type: SELECT_SOURCE,
    payload: { id },
  };
}

/* export function fetchSourceTagList() {
  return {
    type: FETCH_SOURCE_TAG_LIST,
    payload: {
      promise: api.sourceTagList(),
    },
  };
}*/
export function fetchSourceCollectionSetList() {
  return {
    type: FETCH_SOURCE_COLLECTION_LIST,
    payload: {
      promise: api.sourceCollectionSetList(), // need to change this... TODO
    },
  };
}


export function fetchSourceDetails(id) {
  return {
    type: FETCH_SOURCE_DETAILS,
    payload: {
      promise: api.sourceDetails(id),
    },
  };
}
export function fetchSourceCollectionDetails(id) {
  return {
    type: FETCH_SOURCE_COLLECTION_DETAILS,
    payload: {
      promise: api.sourceCollectionDetails(id),
    },
  };
}

export function fetchSentenceCount(id) {
  return {
    type: FETCH_SOURCE_SENTENCE_COUNT,
    payload: {
      promise: api.sourceSentenceCount(id),
    },
  };
}

export function fetchSourceTopWords(itemId, snapshotId, timespanId, sort) {
  return {
    type: FETCH_SOURCE_TOP_WORDS,
    payload: {
      promise: api.topWords(itemId, snapshotId, timespanId, sort),
    },
  };
}

export function fetchSourceCollectionTopWords(itemId, snapshotId, timespanId, sort) {
  return {
    type: FETCH_SOURCE_COLLECTION_TOP_WORDS,
    payload: {
      promise: api.topWords(itemId, snapshotId, timespanId, sort),
    },
  };
}

/*


export function filterBySnapshot(id) {
  return {
    type: SOURCE_FILTER_BY_SNAPSHOT,
    payload: { id },
  };
}

export function filterByTimespan(id) {
  return {
    type: SOURCE_FILTER_BY_TIMESPAN,
    payload: { id },
  };
}


export function fetchSourceSnapshotsList(id) {
  return {
    type: FETCH_SOURCE_SNAPSHOTS_LIST,
    payload: {
      promise: api.snapshotsList(id),
    },
  };
}

export function fetchSourceSnapshotTimespansList(itemId, snapshotId) {
  return {
    type: FETCH_SOURCE_TIMESPANS_LIST,
    payload: {
      promise: api.snapshotTimespansList(itemId, snapshotId),
    },
  };
}*/

