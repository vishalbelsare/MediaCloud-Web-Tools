import { createAction } from 'redux-actions';
import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/topics';

export const FETCH_TOPIC_FOCAL_SETS_LIST = 'FETCH_TOPIC_FOCAL_SETS_LIST';
export const CREATE_FOCAL_SET_DEFINITION = 'CREATE_FOCAL_SET_DEFINITION';
export const FETCH_FOCAL_SET_DEFINITIONS = 'FETCH_FOCAL_SET_DEFINITIONS';
export const DELETE_FOCAL_SET_DEFINITION = 'DELETE_FOCAL_SET_DEFINITION';
export const SET_ATTENTION_FOCAL_SET_ID = 'SET_ATTENTION_FOCAL_SET_ID';
export const FETCH_CREATE_FOCUS_RETWEET_STORY_COUNTS = 'FETCH_CREATE_FOCUS_RETWEET_STORY_COUNTS';
export const FETCH_CREATE_FOCUS_RETWEET_COVERAGE = 'FETCH_CREATE_FOCUS_RETWEET_COVERAGE';
export const FETCH_CREATE_FOCUS_TOP_COUNTRIES_STORY_COUNTS = 'FETCH_CREATE_FOCUS_TOP_COUNTRIES_STORY_COUNTS';
export const FETCH_CREATE_FOCUS_TOP_COUNTRIES_COVERAGE = 'FETCH_CREATE_FOCUS_TOP_COUNTRIES_COVERAGE';
export const FETCH_CREATE_FOCUS_THEME_STORY_COUNTS = 'FETCH_CREATE_FOCUS_THEME_STORY_COUNTS';
export const FETCH_CREATE_FOCUS_THEME_COVERAGE = 'FETCH_CREATE_FOCUS_THEME_COVERAGE';


// pass in topicId and snapshotId
export const fetchTopicFocalSetsList = createAsyncAction(FETCH_TOPIC_FOCAL_SETS_LIST, api.topicFocalSetsList);

// pass in topicId and params (object with name, description, and focalTechnique attributes)
export const createFocalSetDefinition = createAsyncAction(CREATE_FOCAL_SET_DEFINITION, api.createFocalSetDefinition);

// pass in the topicId
export const fetchFocalSetDefinitions = createAsyncAction(FETCH_FOCAL_SET_DEFINITIONS, api.listFocalSetDefinitions);

// pass in topicId and focalSetDefinitionId
export const deleteFocalSetDefinition = createAsyncAction(DELETE_FOCAL_SET_DEFINITION, api.deleteFocalSetDefinition);

export const setAttentionFocalSetId = createAction(SET_ATTENTION_FOCAL_SET_ID, id => id);

export const fetchCreateFocusRetweetStoryCounts = createAsyncAction(FETCH_CREATE_FOCUS_RETWEET_STORY_COUNTS, api.topicPreviewRetweetPartisanshipStoryCounts);

export const fetchCreateFocusTopCountriesStoryCounts = createAsyncAction(FETCH_CREATE_FOCUS_TOP_COUNTRIES_STORY_COUNTS, api.topicPreviewTopCountriesStoryCounts);

export const fetchCreateFocusThemeStoryCounts = createAsyncAction(FETCH_CREATE_FOCUS_THEME_STORY_COUNTS, api.topicPreviewThemeStoryCounts);

export const fetchCreateFocusRetweetCoverage = createAsyncAction(FETCH_CREATE_FOCUS_RETWEET_COVERAGE, api.topicPreviewRetweetPartisanshipCoverage);

export const fetchCreateFocusTopCountriesCoverage = createAsyncAction(FETCH_CREATE_FOCUS_TOP_COUNTRIES_COVERAGE, api.topicPreviewTopCountriesCoverage);

export const fetchCreateFocusThemeCoverage = createAsyncAction(FETCH_CREATE_FOCUS_THEME_COVERAGE, api.topicPreviewThemeCoverage);
