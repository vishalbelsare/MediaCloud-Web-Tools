import { createAction } from 'redux-actions';
import { createAsyncAction } from '../../lib/reduxHelpers';
import * as api from '../../lib/serverApi/topics';

export const FETCH_TOPIC_FOCAL_SETS_LIST = 'FETCH_TOPIC_FOCAL_SETS_LIST';
export const CREATE_FOCAL_SET_DEFINITION = 'CREATE_FOCAL_SET_DEFINITION';
export const FETCH_FOCAL_SET_DEFINITIONS = 'FETCH_FOCAL_SET_DEFINITIONS';
export const DELETE_FOCAL_SET_DEFINITION = 'DELETE_FOCAL_SET_DEFINITION';
export const SET_ATTENTION_FOCAL_SET_ID = 'SET_ATTENTION_FOCAL_SET_ID';

// pass in topicId and snapshotId
export const fetchTopicFocalSetsList = createAsyncAction(FETCH_TOPIC_FOCAL_SETS_LIST, api.topicFocalSetsList);

// pass in topicId and params (object with name, description, and focalTechnique attributes)
export const createFocalSetDefinition = createAsyncAction(CREATE_FOCAL_SET_DEFINITION, api.createFocalSetDefinition);

// pass in the topicId
export const fetchFocalSetDefinitions = createAsyncAction(FETCH_FOCAL_SET_DEFINITIONS, api.listFocalSetDefinitions);

// pass in topicId and focalSetDefinitionId
export const deleteFocalSetDefinition = createAsyncAction(DELETE_FOCAL_SET_DEFINITION, api.deleteFocalSetDefinition);

export const setAttentionFocalSetId = createAction(SET_ATTENTION_FOCAL_SET_ID, id => id);

