import { createAction } from 'redux-actions';
import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/topics';

export const UPDATE_OR_CREATE_FOCUS_DEFINITION = 'UPDATE_OR_CREATE_FOCUS_DEFINITION';

export const CREATE_FOCUS_DEFINITION = 'CREATE_FOCUS_DEFINITION';
export const DELETE_FOCUS_DEFINITION = 'DELETE_FOCUS_DEFINITION';
export const GO_TO_CREATE_FOCUS_STEP = 'GO_TO_CREATE_FOCUS_STEP';
export const FETCH_CREATE_FOCUS_KEYWORD_STORIES = 'FETCH_CREATE_FOCUS_KEYWORD_STORIES';
export const FETCH_CREATE_FOCUS_KEYWORD_ATTENTION = 'FETCH_CREATE_FOCUS_KEYWORD_ATTENTION';
export const FETCH_CREATE_FOCUS_KEYWORD_STORY_COUNTS = 'FETCH_CREATE_FOCUS_KEYWORD_STORY_COUNTS';

export const submitFocusUpdateOrCreate = createAsyncAction(UPDATE_OR_CREATE_FOCUS_DEFINITION, api.updateOrCreateFocusDefinition);

// pass in topicId and focusDefenitionId
export const deleteFocusDefinition = createAsyncAction(DELETE_FOCUS_DEFINITION, api.deleteFocusDefinition);

// pass in the number of the step to go to
export const goToCreateFocusStep = createAction(GO_TO_CREATE_FOCUS_STEP, step => step);

// pass in topicId, limit, q
export const fetchCreateFocusKeywordStories = createAsyncAction(FETCH_CREATE_FOCUS_KEYWORD_STORIES, api.topicTopStories);

// pass in topicId, q
export const fetchCreateFocusKeywordAttention = createAsyncAction(FETCH_CREATE_FOCUS_KEYWORD_ATTENTION, api.topicSentenceCounts);

// pass in topicId, q
export const fetchCreateFocusKeywordStoryCounts = createAsyncAction(FETCH_CREATE_FOCUS_KEYWORD_STORY_COUNTS, api.topicStoryCounts);
