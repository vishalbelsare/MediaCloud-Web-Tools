import { createAction } from 'redux-actions';
import { createAsyncAction } from '../lib/reduxHelpers';
import * as api from '../lib/serverApi/stories';

// pass in story id
export const FETCH_STORY_INFO = 'FETCH_STORY_INFO';
export const fetchStoryInfo = createAsyncAction(FETCH_STORY_INFO, api.storyDetails, params => params);

// pass in story id
export const FETCH_STORY_ENTITIES = 'FETCH_STORY_ENTITIES';
export const fetchStoryEntities = createAsyncAction(FETCH_STORY_ENTITIES, api.storyEntities);

// pass in story id
export const FETCH_STORY_NYT_THEMES = 'FETCH_STORY_NYT_THEMES';
export const fetchStoryNytThemes = createAsyncAction(FETCH_STORY_NYT_THEMES, api.storyNytThemes);

export const SELECT_STORY = 'SELECT_STORY';
export const FETCH_STORY = 'FETCH_STORY';
export const FETCH_STORY_WORDS = 'FETCH_STORY_WORDS';
export const FETCH_STORY_INLINKS = 'FETCH_STORY_INLINKS';
export const FETCH_STORY_OUTLINKS = 'FETCH_STORY_OUTLINKS';


// pass in stories id
export const selectStory = createAction(SELECT_STORY, id => id);

// pass in topic id, story id, and filters
export const fetchStory = createAsyncAction(FETCH_STORY, api.story);

// pass in topic id and story id
export const fetchStoryWords = createAsyncAction(FETCH_STORY_WORDS, api.storyWords);

// pass in topic id, story id, and filters
export const fetchStoryInlinks = createAsyncAction(FETCH_STORY_INLINKS, api.storyInlinks);

// pass in topic id, story id, and filters
export const fetchStoryOutlinks = createAsyncAction(FETCH_STORY_OUTLINKS, api.storyOutlinks);
