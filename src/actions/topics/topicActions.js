import { createAction } from 'redux-actions';
import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/topics';

export const FETCH_TOPIC_LIST = 'FETCH_TOPIC_LIST';
export const SET_TOPIC_LIST_FILTER = 'SET_TOPIC_LIST_FILTER';
export const FETCH_PUBLIC_TOPICS_LIST = 'FETCH_PUBLIC_TOPICS_LIST';
export const TOPIC_FILTER_BY_SNAPSHOT = 'TOPIC_FILTER_BY_SNAPSHOT';
export const TOPIC_FILTER_BY_TIMESPAN = 'TOPIC_FILTER_BY_TIMESPAN';
export const TOPIC_FILTER_BY_QUERY = 'TOPIC_FILTER_BY_QUERY';
export const FETCH_TOPIC_SUMMARY = 'FETCH_TOPIC_SUMMARY';
export const TOPIC_FILTER_BY_FOCUS = 'TOPIC_FILTER_BY_FOCUS';
export const FETCH_TOPIC_SNAPSHOTS_LIST = 'FETCH_TOPIC_SNAPSHOTS_LIST';
export const FETCH_TOPIC_TIMESPANS_LIST = 'FETCH_TOPIC_TIMESPANS_LIST';
export const TOGGLE_TIMESPAN_CONTROLS = 'TOGGLE_TIMESPAN_CONTROLS';
export const TOGGLE_FILTER_CONTROLS = 'TOGGLE_FILTER_CONTROLS';
export const SET_TIMESPAN_VISIBLE_PERIOD = 'SET_TIMESPAN_VISIBLE_PERIOD';
export const SELECT_TOPIC = 'SELECT_TOPIC';
export const SET_TOPIC_FAVORITE = 'SET_TOPIC_FAVORITE';
export const FETCH_FAVORITE_TOPICS = 'FETCH_FAVORITE_TOPICS';
export const UPDATE_TOPIC = 'UPDATE_TOPIC';
export const TOPIC_START_SPIDER = 'TOPIC_START_SPIDER';
export const SET_TOPIC_NEEDS_NEW_SNAPSHOT = 'SET_TOPIC_NEEDS_NEW_SNAPSHOT';
export const TOPIC_GENERATE_SNAPSHOT = 'TOPIC_GENERATE_SNAPSHOT';
export const FETCH_TOPIC_SEARCH_RESULTS = 'FETCH_TOPIC_SEARCH_RESULTS';

export const fetchTopicsList = createAsyncAction(FETCH_TOPIC_LIST, api.topicsList);

export const setTopicListFilter = createAction(SET_TOPIC_LIST_FILTER, filter => filter);

export const fetchPublicTopicsList = createAsyncAction(FETCH_PUBLIC_TOPICS_LIST, api.topicsPublicList);

// pass in topicId
export const selectTopic = createAction(SELECT_TOPIC, id => parseInt(id, 10));

// pass in topicId
export const fetchTopicSnapshotsList = createAsyncAction(FETCH_TOPIC_SNAPSHOTS_LIST, api.topicSnapshotsList);

// pass in snapshotId
export const filterBySnapshot = createAction(TOPIC_FILTER_BY_SNAPSHOT, id => id);

// pass in timespanId
export const filterByTimespan = createAction(TOPIC_FILTER_BY_TIMESPAN, id => id);

// pass in focusId
export const filterByFocus = createAction(TOPIC_FILTER_BY_FOCUS, id => id);

// pass in query str
export const filterByQuery = createAction(TOPIC_FILTER_BY_QUERY, str => str);

// pass in topicId
export const fetchTopicSummary = createAsyncAction(FETCH_TOPIC_SUMMARY, api.topicSummary);

// pass in topicId, snapshotId and focusId
export const fetchTopicTimespansList = createAsyncAction(FETCH_TOPIC_TIMESPANS_LIST, api.topicTimespansList);

export const toggleTimespanControls = createAction(TOGGLE_TIMESPAN_CONTROLS, isVisible => isVisible);

export const setTimespanVisiblePeriod = createAction(SET_TIMESPAN_VISIBLE_PERIOD, period => period);

export const toggleFilterControls = createAction(TOGGLE_FILTER_CONTROLS, isVisible => isVisible);

// pass in topicId and favorite bool
export const setTopicFavorite = createAsyncAction(SET_TOPIC_FAVORITE, api.topicSetFavorite);

export const fetchFavoriteTopics = createAsyncAction(FETCH_FAVORITE_TOPICS, api.favoriteTopics);

export const updateTopic = createAsyncAction(UPDATE_TOPIC, api.updateTopic);

export const topicStartSpider = createAsyncAction(TOPIC_START_SPIDER, api.topicSpider, id => id);

// pass in topic id, filters
export const fetchTopicSearchResults = createAsyncAction(FETCH_TOPIC_SEARCH_RESULTS, api.fetchTopicSearchResults, searchStr => searchStr);

// pass in a boolean
export const setTopicNeedsNewSnapshot = createAction(SET_TOPIC_NEEDS_NEW_SNAPSHOT, needsNewSnapshot => needsNewSnapshot);

// pass in topic Id
export const generateSnapshot = createAsyncAction(TOPIC_GENERATE_SNAPSHOT, api.topicGenerateSnapshot);
