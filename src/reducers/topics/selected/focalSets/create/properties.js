import { SET_NEW_FOCUS_PROPERTIES } from '../../../../../actions/topicActions';
import { createReducer } from '../../../../../lib/reduxHelpers';

export const INITIAL_STATE = {
  topicId: null,
  name: null,
  description: null,
  focalSetId: null,
  focalTechnique: null,
  focalSetName: null,
  focalSetDescription: null,
};

const createFociReducer = createReducer({
  initialState: INITIAL_STATE,
  SET_NEW_FOCUS_PROPERTIES: (payload) => ({ ...payload }),
});

export default createFociReducer;
