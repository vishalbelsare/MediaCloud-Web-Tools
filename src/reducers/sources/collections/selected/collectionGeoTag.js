import { createAsyncReducer } from '../../../../lib/reduxHelpers';
import { FETCH_COLLECTION_GEO } from '../../../../actions/sourceActions';


const geoTag = createAsyncReducer({
  initialState: {
    total: null,
    list: [],
  },
  action: FETCH_COLLECTION_GEO,
  handleSuccess: payload => ({
    total: payload.results.geography.total,
    list: payload.results.geography,
  }),
});
export default geoTag;
