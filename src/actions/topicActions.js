import { createAction } from 'redux-actions';
import { createAsyncAction } from '../lib/reduxHelpers';
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
export const FETCH_TOPIC_FOCAL_SETS_LIST = 'FETCH_TOPIC_FOCAL_SETS_LIST';
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
export const FETCH_MEDIA_SENTENCE_COUNT = 'FETCH_MEDIA_SENTENCE_COUNT';
export const FETCH_MEDIA_STORIES = 'FETCH_MEDIA_STORIES';
export const SORT_MEDIA_STORIES = 'SORT_MEDIA_STORIES';
export const FETCH_MEDIA_INLINKS = 'FETCH_MEDIA_INLINKS';
export const SORT_MEDIA_INLINKS = 'SORT_MEDIA_INLINKS';
export const FETCH_MEDIA_OUTLINKS = 'FETCH_MEDIA_OUTLINKS';
export const SORT_MEDIA_OUTLINKS = 'SORT_MEDIA_OUTLINKS';
export const FETCH_MEDIA_WORDS = 'FETCH_MEDIA_WORDS';
export const TOGGLE_TIMESPAN_CONTROLS = 'TOGGLE_TIMESPAN_CONTROLS';
export const SET_TIMESPAN_VISIBLE_PERIOD = 'SET_TIMESPAN_VISIBLE_PERIOD';
export const SET_NEW_FOCUS_PROPERTIES = 'SET_NEW_FOCUS_PROPERTIES';
export const GO_TO_CREATE_FOCUS_STEP = 'GO_TO_CREATE_FOCUS_STEP';
export const FETCH_CREATE_FOCUS_KEYWORD_STORIES = 'FETCH_CREATE_FOCUS_KEYWORD_STORIES';
export const CREATE_FOCAL_SET_DEFINITION = 'CREATE_FOCAL_SET_DEFINITION';
export const FETCH_FOCAL_SET_DEFINITIONS = 'FETCH_FOCAL_SET_DEFINITIONS';
export const SET_TOPIC_NEEDS_NEW_SNAPSHOT = 'SET_TOPIC_NEEDS_NEW_SNAPSHOT';
export const CREATE_FOCUS_DEFINITION = 'CREATE_FOCUS_DEFINITION';
export const TOPIC_FILTER_BY_FOCUS = 'TOPIC_FILTER_BY_FOCUS';
export const DELETE_FOCUS_DEFINITION = 'DELETE_FOCUS_DEFINITION';
export const TOPIC_GENERATE_SNAPSHOT = 'TOPIC_GENERATE_SNAPSHOT';
export const UPDATE_TOPIC_PERMISSION = 'UPDATE_TOPIC_PERMISSION';
export const FETCH_TOPIC_PERMISSIONS = 'FETCH_TOPIC_PERMISSIONS';

export const fetchTopicsList = createAsyncAction(FETCH_TOPIC_LIST, api.topicsList);

// pass in topicId
export const selectTopic = createAction(SELECT_TOPIC, id => parseInt(id, 10));

// pass in topicId
export const fetchTopicSnapshotsList = createAsyncAction(FETCH_TOPIC_SNAPSHOTS_LIST, api.topicSnapshotsList);
// pass in snapshotId
export const filterBySnapshot = createAction(TOPIC_FILTER_BY_SNAPSHOT, id => id);
// pass in topicId, snapshotId and focusId
export const fetchTopicTimespansList = createAsyncAction(FETCH_TOPIC_TIMESPANS_LIST, api.topicTimespansList);
// pass in topicId and snapshotId
export const fetchTopicFocalSetsList = createAsyncAction(FETCH_TOPIC_FOCAL_SETS_LIST, api.topicFocalSetsList);
// pass in timespanId
export const filterByTimespan = createAction(TOPIC_FILTER_BY_TIMESPAN, id => id);
// pass in focusId
export const filterByFocus = createAction(TOPIC_FILTER_BY_FOCUS, id => id);

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
// pass in topic id, story id, and filters
export const fetchStoryInlinks = createAsyncAction(FETCH_STORY_INLINKS, api.storyInlinks);
// pass in topic id, story id, and filters
export const fetchStoryOutlinks = createAsyncAction(FETCH_STORY_OUTLINKS, api.storyOutlinks);

// pass in media id
export const selectMedia = createAction(SELECT_MEDIA, id => id);
// pass in topic id, media id, snapshot id, timespan id
export const fetchMedia = createAsyncAction(FETCH_MEDIA, api.media);
// pass in topic id, media id, snapshot id, timespan id
export const fetchMediaSentenceCounts = createAsyncAction(FETCH_MEDIA_SENTENCE_COUNT, api.mediaSentenceCounts);
// pass in topic id, media id, snapshot id, timespan id, sort, limit
export const fetchMediaStories = createAsyncAction(FETCH_MEDIA_STORIES, api.mediaStories);
// pass in sort
export const sortMediaStories = createAction(SORT_MEDIA_STORIES, sort => sort);
// pass in topic id, media id, snapshot id, timespan id, sort, limit
export const fetchMediaInlinks = createAsyncAction(FETCH_MEDIA_INLINKS, api.mediaInlinks);
// pass in sort
export const sortMediaInlinks = createAction(SORT_MEDIA_INLINKS, sort => sort);
// pass in topic id, media id, snapshot id, timespan id, sort, limit
export const fetchMediaOutlinks = createAsyncAction(FETCH_MEDIA_OUTLINKS, api.mediaOutlinks);
// pass in sort
export const sortMediaOutlinks = createAction(SORT_MEDIA_OUTLINKS, sort => sort);
// pass in topic id, media id, snapshot id, timespan id
export const fetchMediaWords = createAsyncAction(FETCH_MEDIA_WORDS, api.mediaWords);

export const toggleTimespanControls = createAction(TOGGLE_TIMESPAN_CONTROLS, isVisible => isVisible);
export const setTimespanVisiblePeriod = createAction(SET_TIMESPAN_VISIBLE_PERIOD, period => period);

// pass in array of attributes for the new focus
export const setNewFocusProperties = createAction(SET_NEW_FOCUS_PROPERTIES, props => props);
// pass in the number of the step to go to
export const goToCreateFocusStep = createAction(GO_TO_CREATE_FOCUS_STEP, step => step);
// pass in topicId, snapshotId, timespanId, q
export const fetchCreateFocusKeywordStories = createAsyncAction(FETCH_CREATE_FOCUS_KEYWORD_STORIES, api.topicTopStories);
// pass in topicId and params (object with name, description, and focalTechnique attributes)
export const createFocalSetDefinition = createAsyncAction(CREATE_FOCAL_SET_DEFINITION, api.createFocalSetDefinition);
// pass in the topicId
export const fetchFocalSetDefinitions = createAsyncAction(FETCH_FOCAL_SET_DEFINITIONS, api.listFocalSetDefinitions);
// pass in topicId and params (object with name, description, focal_set_definitions_id, query)
export const createFocusDefinition = createAsyncAction(CREATE_FOCUS_DEFINITION, api.createFocusDefinition);
// pass in topicId and focalSetDefinitionId
export const deleteFocalSetDefinition = createAsyncAction(DELETE_FOCUS_DEFINITION, api.deleteFocalSetDefinition);

// pass in a boolean
export const setTopicNeedsNewSnapshot = createAction(SET_TOPIC_NEEDS_NEW_SNAPSHOT, needsNewSnapshot => needsNewSnapshot);

// pass in topic Id
export const generateSnapshot = createAsyncAction(TOPIC_GENERATE_SNAPSHOT, api.topicGenerateSnapshot);

// pass in topicId, email & permission
export const updatePermission = createAsyncAction(UPDATE_TOPIC_PERMISSION, api.topicUpdatePermission);

// pass in topicId
export const fetchPermissionsList = createAsyncAction(FETCH_TOPIC_PERMISSIONS, api.topicListPermissions);
