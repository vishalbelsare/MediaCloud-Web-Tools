import { createAsyncAction } from '../lib/reduxHelpers';
import * as api from '../lib/serverApi/stories';

// pass in story id
export const FETCH_STORY_INFO = 'FETCH_STORY_INFO';
export const fetchStoryInfo = createAsyncAction(FETCH_STORY_INFO, api.storyDetails);

// pass in story id
export const FETCH_STORY_ENTITIES = 'FETCH_STORY_ENTITIES';
export const fetchStoryEntities = createAsyncAction(FETCH_STORY_ENTITIES, api.storyEntities);

// pass in story id
export const FETCH_STORY_NYT_THEMES = 'FETCH_STORY_NYT_THEMES';
export const fetchStoryNytThemes = createAsyncAction(FETCH_STORY_NYT_THEMES, api.storyNytThemes);
