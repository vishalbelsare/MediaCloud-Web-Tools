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
export const FETCH_TOPIC_INFLUENTIAL_STORIES = 'FETCH_TOPIC_INFLUENTIAL_STORIES';
export const SORT_TOPIC_INFLUENTIAL_STORIES = 'SORT_TOPIC_INFLUENTIAL_STORIES';
export const SELECT_STORY = 'SELECT_STORY';
export const FETCH_STORY = 'FETCH_STORY';
export const FETCH_STORY_WORDS = 'FETCH_STORY_WORDS';
export const FETCH_STORY_INLINKS = 'FETCH_STORY_INLINKS';
export const FETCH_STORY_OUTLINKS = 'FETCH_STORY_OUTLINKS';
export const SELECT_MEDIA = 'SELECT_MEDIA';
export const FETCH_MEDIA = 'FETCH_MEDIA';
export const TOGGLE_TIMESPAN_CONTROLS = 'TOGGLE_TIMESPAN_CONTROLS';
export const SET_TIMESPAN_VISIBLE_PERIOD = 'SET_TIMESPAN_VISIBLE_PERIOD';

export const fetchTopicsList = createAsyncAction(FETCH_TOPIC_LIST, api.topicsList);

// pass in topicId
export const selectTopic = createAction(SELECT_TOPIC, id => parseInt(id, 10));

// pass in topicId
export const fetchTopicSnapshotsList = createAsyncAction(FETCH_TOPIC_SNAPSHOTS_LIST, api.topicSnapshotsList);
// pass in topicId
export const filterBySnapshot = createAction(TOPIC_FILTER_BY_SNAPSHOT, id => id);
// pass in topicId
export const fetchTopicTimespansList = createAsyncAction(FETCH_TOPIC_TIMESPANS_LIST, api.topicTimespansList);
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

// pass in topicId, snapshotId, timespanId, sort, limit, linkId
export const fetchTopicInfluentialMedia = createAsyncAction(FETCH_TOPIC_INFLUENTIAL_MEDIA, api.topicTopMedia);
// pass in sort
export const sortTopicInfluentialMedia = createAction(SORT_TOPIC_INFLUENTIAL_MEDIA, sort => sort);

// pass in topicId, snapshotId, timespanId, sort, limit, linkId
export const fetchTopicInfluentialStories = createAsyncAction(FETCH_TOPIC_INFLUENTIAL_STORIES, api.topicTopStories);
// pass in sort
export const sortTopicInfluentialStories = createAction(SORT_TOPIC_INFLUENTIAL_STORIES, sort => sort);

// pass in stories id
export const selectStory = createAction(SELECT_STORY, id => id);
// pass in topic id and story id
export const fetchStory = createAsyncAction(FETCH_STORY, api.story);
// pass in topic id and story id
export const fetchStoryWords = createAsyncAction(FETCH_STORY_WORDS, api.storyWords);
// pass in topic id, timespan id, and story id
export const fetchStoryInlinks = createAsyncAction(FETCH_STORY_INLINKS, api.storyInlinks);
// pass in topic id, timespan id, and story id
export const fetchStoryOutlinks = createAsyncAction(FETCH_STORY_OUTLINKS, api.storyOutlinks);

// pass in media id
export const selectMedia = createAction(SELECT_MEDIA, id => id);
// pass in topic id and media id
export const fetchMedia = createAsyncAction(FETCH_MEDIA, api.media);

export const toggleTimespanControls = createAction(TOGGLE_TIMESPAN_CONTROLS, isVisible => isVisible);
export const setTimespanVisiblePeriod = createAction(SET_TIMESPAN_VISIBLE_PERIOD, period => period);
