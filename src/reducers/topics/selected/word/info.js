import moment from 'moment';
import { FETCH_WORD, SELECT_WORD } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const info = createAsyncReducer({
  initialState: {
    id: null,
  },
  action: FETCH_WORD,
  handleSuccess: payload => ({
    ...payload,
    publishDateObj: moment(payload.publish_date).toDate(),
  }),
  [SELECT_WORD]: payload => ({ id: payload }),
});

export default info;
