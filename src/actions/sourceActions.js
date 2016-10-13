import { createAction } from 'redux-actions';
import { createAsyncAction } from '../lib/reduxHelpers';
import * as api from '../lib/sources';

// export const FETCH_SOURCE_LIST = 'FETCH_SOURCE_LIST';
export const FETCH_SOURCE_LIST = 'FETCH_SOURCE_LIST';
export const FETCH_COLLECTION_LIST = 'FETCH_COLLECTION_LIST';
export const FETCH_SOURCE_DETAILS = 'FETCH_SOURCE_DETAILS';
export const FETCH_COLLECTION_DETAILS = 'FETCH_COLLECTION_DETAILS';
export const SELECT = 'SELECT';
export const SOURCE_FILTER_BY_SNAPSHOT = 'SOURCE_FILTER_BY_SNAPSHOT';
export const SOURCE_FILTER_BY_TIMESPAN = 'SOURCE_FILTER_BY_TIMESPAN';
export const FETCH_SOURCE_SUMMARY = 'FETCH_SOURCE_SUMMARY';
// export const FETCH_SOURCE_TOP_STORIES = 'FETCH_SOURCE_TOP_STORIES';
// // export const SORT_SOURCE_TOP_STORIES = 'SORT_SOURCE_TOP_STORIES';
// export const FETCH_SOURCE_TOP_MEDIA = 'FETCH_SOURCE_TOP_MEDIA';
export const SORT_SOURCE_DETAILS = 'SORT_SOURCE_DETAILS';
export const SORT_COLLECTION_DETAILS = 'SORT_COLLECTION_DETAILS';
export const FETCH_SOURCE_TOP_WORDS = 'FETCH_SOURCE_TOP_WORDS';
export const FETCH_COLLECTION_TOP_WORDS = 'FETCH_COLLECTION_TOP_WORDS';
export const FETCH_SOURCE_SNAPSHOTS_LIST = 'FETCH_SOURCE_SNAPSHOTS_LIST';
export const FETCH_SOURCE_TIMESPANS_LIST = 'FETCH_SOURCE_TIMESPANS_LIST';
export const FETCH_SOURCE_SENTENCE_COUNT = 'FETCH_SOURCE_SENTENCE_COUNT';
export const FETCH_COLLECTION_SENTENCE_COUNT = 'FETCH_COLLECTION_SENTENCE_COUNT';
export const FETCH_SOURCE_GEO = 'FETCH_SOURCE_GEO';
export const FETCH_COLLECTION_GEO = 'FETCH_COLLECTION_GEO';
export const FETCH_SOURCE_SEARCH = 'FETCH_SOURCE_SEARCH';

export const select = createAction(SELECT, id => id);

export const fetchSourceList = createAsyncAction(FETCH_SOURCE_LIST, api.sourceList);

export const fetchSourceCollectionList = createAsyncAction(FETCH_COLLECTION_LIST, api.sourceCollectionList);

export const fetchSourceDetails = createAsyncAction(FETCH_SOURCE_DETAILS, api.sourceDetails, id => id);

export const fetchSourceCollectionDetails = createAsyncAction(FETCH_COLLECTION_DETAILS, api.sourceCollectionDetails, id => id);

export const fetchSourceSentenceCount = createAsyncAction(FETCH_SOURCE_SENTENCE_COUNT, api.sourceSentenceCount, id => id);

export const fetchSourceCollectionSentenceCount = createAsyncAction(FETCH_COLLECTION_SENTENCE_COUNT, api.sourceCollectionSentenceCount, id => id);

export const fetchSourceTopWords = createAsyncAction(FETCH_SOURCE_TOP_WORDS, api.sourceWordCount, id => id);

export const fetchSourceCollectionTopWords = createAsyncAction(FETCH_COLLECTION_TOP_WORDS, api.sourceCollectionWordCount, id => id);

export const fetchSourceGeo = createAsyncAction(FETCH_SOURCE_GEO, api.sourceGeography, id => id);

export const fetchSourceCollectionGeo = createAsyncAction(FETCH_COLLECTION_GEO, api.sourceCollectionGeography, id => id);

export const fetchSourceSearch = createAsyncAction(FETCH_SOURCE_SEARCH, api.sourceSearch, string => string);
