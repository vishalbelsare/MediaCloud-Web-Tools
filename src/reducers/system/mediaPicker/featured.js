import { FETCH_FEATURED_COLLECTIONS_FOR_QUERY } from '../../../actions/explorerActions';
import { createAsyncReducer } from '../../../lib/reduxHelpers';

const featured = createAsyncReducer({
  action: FETCH_FEATURED_COLLECTIONS_FOR_QUERY,
});
export default featured;
