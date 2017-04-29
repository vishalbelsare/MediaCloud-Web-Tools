import { createAsyncReducer } from '../../../../../lib/reduxHelpers';
import { FETCH_SOURCE_FEEDS } from '../../../../../actions/sourceActions';


const feeds = createAsyncReducer({
  initialState: {
    count: 0,
    list: [],
  },
  action: FETCH_SOURCE_FEEDS,
  handleSuccess: payload => ({
    count: payload.count,
    list: payload.results,
  }),
});
export default feeds;
