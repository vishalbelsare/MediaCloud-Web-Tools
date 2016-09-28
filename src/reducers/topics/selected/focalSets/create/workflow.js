import { GO_TO_CREATE_FOCUS_STEP } from '../../../../../actions/topicActions';
import { createReducer } from '../../../../../lib/reduxHelpers';

const createFociReducer = createReducer({
  initialState: {
    currentStep: 0,
  },
  [GO_TO_CREATE_FOCUS_STEP]: payload => ({
    currentStep: payload,
  }),
});

export default createFociReducer;
