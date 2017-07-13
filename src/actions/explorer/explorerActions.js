import { createAction } from 'redux-actions';
import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/explorer';

export const UPDATE_TIMESTAMP_FOR_QUERIES = 'UPDATE_TIMESTAMP_FOR_QUERIES';
export const updateTimestampForQueries = createAction(UPDATE_TIMESTAMP_FOR_QUERIES, queries => queries);

export const FETCH_SAMPLE_SEARCHES = 'FETCH_SAMPLE_SEARCHES';
export const fetchSampleSearches = createAsyncAction(FETCH_SAMPLE_SEARCHES, api.fetchSampleSearches);

export const SELECT_SEARCH_BY_ID = 'SELECT_SEARCH_BY_ID';
export const selectBySearchId = createAction(SELECT_SEARCH_BY_ID, searchId => searchId);

export const SELECT_SEARCH_BY_PARAMS = 'SELECT_SEARCH_BY_PARAMS';
export const selectBySearchParams = createAction(SELECT_SEARCH_BY_PARAMS, searchParams => searchParams);


export const FETCH_SAVED_SEARCHES = 'FETCH_SAVED_SEARCHES';
export const fetchSavedSearches = createAsyncAction(FETCH_SAVED_SEARCHES, api.fetchSavedSearches);

export const SELECT_QUERY = 'SELECT_QUERY';
export const selectQuery = createAction(SELECT_QUERY, query => query);

export const ADD_CUSTOM_QUERY = 'ADD_CUSTOM_QUERY';
export const addCustomQuery = createAction(ADD_CUSTOM_QUERY, query => query);

export const UPDATE_QUERY = 'UPDATE_QUERY';
export const updateQuery = createAction(UPDATE_QUERY, query => query);


export const PREPARE_QUERIES = 'PREPARE_QUERIES';
export const prepareQueries = createAsyncAction(PREPARE_QUERIES, api.prepareQueries);

export const FETCH_QUERY_SENTENCE_COUNTS = 'FETCH_QUERY_SENTENCE_COUNTS';
export const fetchQuerySentenceCounts = createAsyncAction(FETCH_QUERY_SENTENCE_COUNTS, api.fetchQuerySentenceCounts, params => params);

export const FETCH_DEMO_QUERY_SENTENCE_COUNTS = 'FETCH_DEMO_QUERY_SENTENCE_COUNTS';
export const fetchDemoQuerySentenceCounts = createAsyncAction(FETCH_DEMO_QUERY_SENTENCE_COUNTS, api.fetchDemoQuerySentenceCounts, params => params);

export const FETCH_DEMO_QUERY_SAMPLE_STORIES = 'FETCH_DEMO_QUERY_SAMPLE_STORIES';
export const fetchDemoQuerySampleStories = createAsyncAction(FETCH_DEMO_QUERY_SAMPLE_STORIES, api.fetchDemoQuerySampleStories, params => params);

export const FETCH_DEMO_QUERY_STORY_COUNT = 'FETCH_DEMO_QUERY_STORY_COUNT';
export const fetchDemoQueryStoryCount = createAsyncAction(FETCH_DEMO_QUERY_STORY_COUNT, api.fetchDemoQueryStoryCount, params => params);

export const FETCH_DEMO_QUERY_GEO = 'FETCH_DEMO_QUERY_GEO';
export const fetchDemoQueryGeo = createAsyncAction(FETCH_DEMO_QUERY_GEO, api.fetchDemoQueryGeo, params => params);

export const FETCH_DEMO_QUERY_SOURCES = 'FETCH_DEMO_QUERY_SOURCES';
export const demoQuerySourcesByIds = createAsyncAction(FETCH_DEMO_QUERY_SOURCES, api.demoQuerySourcesByIds, props => props);

export const FETCH_DEMO_QUERY_COLLECTIONS = 'FETCH_DEMO_QUERY_COLLECTIONS';
export const demoQueryCollectionsByIds = createAsyncAction(FETCH_DEMO_QUERY_COLLECTIONS, api.demoQueryCollectionsByIds, props => props);

export const RESET_QUERIES = 'RESET_QUERIES';
export const resetQueries = createAction(RESET_QUERIES);

export const RESET_SENTENCE_COUNTS = 'RESET_SENTENCE_COUNTS';
export const resetSentenceCounts = createAction(RESET_SENTENCE_COUNTS);

