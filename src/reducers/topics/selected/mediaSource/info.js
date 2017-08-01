import { FETCH_MEDIA, SELECT_MEDIA } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const info = createAsyncReducer({
  initialState: {
    id: null,
  },
  action: FETCH_MEDIA,
  [SELECT_MEDIA]: payload => ({ id: payload }),
});

export default info;
