import { SET_NEW_FOCUS_PROPERTIES } from '../../../../../actions/topicActions';
import { createReducer } from '../../../../../lib/reduxHelpers';

const createFociReducer = createReducer({
  initialState: {
    topicId: null,
    name: null,
    description: null,
    focalSetId: null,
    focalTechnique: null,
  },
  SET_NEW_FOCUS_PROPERTIES: (payload) => ({ ...payload }),
});

export default createFociReducer;
