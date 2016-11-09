import { SELECT_WORD } from '../../../../actions/topicActions';
import { createReducer } from '../../../../lib/reduxHelpers';

const info = createReducer({
  initialState: {
    term: null,
    stem: null,
  },
  [SELECT_WORD]: payload => ({ ...payload }),
});

export default info;
