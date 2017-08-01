import { FETCH_MEDIA } from '../../actions/explorerActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

const media = createAsyncReducer({
  action: FETCH_MEDIA,
});
export default media;
