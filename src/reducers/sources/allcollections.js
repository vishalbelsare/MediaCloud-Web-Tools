import { FETCH_SOURCE_COLLECTION_LIST } from '../../actions/sourceActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

// TODO: replace this with normalizr? https://github.com/gaearon/normalizr
function arrayToDict(arr, keyPropertyName) {
  const dict = {};
  arr.forEach((item) => {
    if (item.show_on_media === 1) {
      dict[item[keyPropertyName]] = item;
    }
  });
  return dict;
}

const allCollections = createAsyncReducer({
  initialState: {
    total: null,
    list: [],
  },
  action: FETCH_SOURCE_COLLECTION_LIST,
  handleFetch: () => ({ list: [], total: null }),
  handleSuccess: (payload) => ({
    total: payload.results.total,
    list: arrayToDict(payload.results, 'tags_id'),
  }),
  handleFailure: () => ({ list: [], total: null }),
});
export default allCollections;
