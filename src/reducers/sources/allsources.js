
import { FETCH_SOURCE_LIST } from '../../actions/sourceActions';
import { createAsyncReducer } from '../../lib/reduxHelpers';

// TODO: replace this with normalizr? https://github.com/gaearon/normalizr
function arrayToDict(arr, keyPropertyName) {
  const dict = {};
  arr.forEach((item) => {
    dict[item[keyPropertyName]] = item;
  });
  return dict;
}

const all = createAsyncReducer({
  initialState: {
    total: null,
    list: [],
  },
  action: FETCH_SOURCE_LIST,
  handleFetch: () => ({ list: [], total: null }),
  handleSuccess: (payload) => ({
    total: payload.results.total,
    list: arrayToDict(payload.results, 'media_id'),
  }),
  handleFailure: () => ({ list: [], total: null }),
});
export default all;
