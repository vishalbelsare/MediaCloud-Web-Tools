import { SET_NEW_FOCUS_PROPERTIES } from '../../../../actions/topicActions';
import { createReducer } from '../../../../lib/reduxHelpers';

const createFociReducer = createReducer({
  initialState: {
    currentStep: 0,
    properties: {
      topicId: null,
      name: null,
      focalSetId: null,
      focalTechnique: null,
    },
  },
  SET_NEW_FOCUS_PROPERTIES: (payload, state) => ({
    properties: Object.assign({}, state.properties, { ...payload }),
  }),
});

export default createFociReducer;
