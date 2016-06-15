import * as api from '../lib/topics';
import { createAction } from 'redux-actions';
import { createAsyncAction } from '../lib/reduxHelpers';
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
export const FETCH_TOPIC_SENTENCE_COUNT = 'FETCH_TOPIC_SENTENCE_COUNT';
export const FETCH_TOPIC_INFLUENTIAL_MEDIA = 'FETCH_TOPIC_INFLUENTIAL_MEDIA';
export const SORT_TOPIC_INFLUENTIAL_MEDIA = 'SORT_TOPIC_INFLUENTIAL_MEDIA';

export const fetchTopicsList = createAsyncAction(FETCH_TOPIC_LIST, api.topicsList);

// pass in topicId
export const selectTopic = createAction(SELECT_TOPIC, id => id);

// pass in topicId
export const fetchTopicSnapshotsList = createAsyncAction(FETCH_TOPIC_SNAPSHOTS_LIST, api.topicSnapshotsList);
// pass in topicId
export const filterBySnapshot = createAction(TOPIC_FILTER_BY_SNAPSHOT, id => id);
// pass in topicId
export const fetchTopicSnapshotTimespansList = createAsyncAction(FETCH_TOPIC_TIMESPANS_LIST, api.topicSnapshotTimespansList);
// pass in topicId
export const filterByTimespan = createAction(TOPIC_FILTER_BY_TIMESPAN, id => id);

// pass in topicId
export const fetchTopicSummary = createAsyncAction(FETCH_TOPIC_SUMMARY, api.topicSummary);
// pass in topicId, snapshotId, timespanId, sort, limit
export const fetchTopicTopStories = createAsyncAction(FETCH_TOPIC_TOP_STORIES, api.topicTopStories);
// pass in sort
export const sortTopicTopStories = createAction(SORT_TOPIC_TOP_STORIES, sort => sort);
// pass in topicId, snapshotId, timespanId, sort, limit
export const fetchTopicTopMedia = createAsyncAction(FETCH_TOPIC_TOP_MEDIA, api.topicTopMedia);
// pass in sort
export const sortTopicTopMedia = createAction(SORT_TOPIC_TOP_MEDIA, sort => sort);
// pass in topicId, snapshotId, timespanId, sort
export const fetchTopicTopWords = createAsyncAction(FETCH_TOPIC_TOP_WORDS, api.topicTopWords);
// pass in topicId, snapshotId, timespanId
export const fetchTopicSentenceCounts = createAsyncAction(FETCH_TOPIC_SENTENCE_COUNT, api.topicSentenceCounts);

// pass in topicId, snapshotId, timespanId, sort, limit
export const fetchTopicInfluentialMedia = createAsyncAction(FETCH_TOPIC_INFLUENTIAL_MEDIA, api.topicTopMedia);
// pass in sort
export const sortTopicInfluentialMedia = createAction(SORT_TOPIC_INFLUENTIAL_MEDIA, sort => sort);
