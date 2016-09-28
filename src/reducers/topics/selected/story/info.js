import moment from 'moment';
import { FETCH_STORY, SELECT_STORY } from '../../../../actions/topicActions';
import { createAsyncReducer } from '../../../../lib/reduxHelpers';

const info = createAsyncReducer({
  initialState: {
    id: null,
  },
  action: FETCH_STORY,
  handleSuccess: payload => ({
    ...payload,
    publishDateObj: moment(payload.publish_date).toDate(),
  }),
  [SELECT_STORY]: payload => ({ id: payload }),
});

export default info;
