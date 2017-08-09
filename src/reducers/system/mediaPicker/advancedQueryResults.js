import { FETCH_MEDIA_FOR_QUERY } from '../../../actions/explorerActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const advancedQueryResults = createAsyncReducer({
  action: FETCH_MEDIA_FOR_QUERY,
});
export default advancedQueryResults;

